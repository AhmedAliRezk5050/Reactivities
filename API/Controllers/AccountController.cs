using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly UserManager<AppUser> _userManager;

    private readonly SignInManager<AppUser> _signInManager;

    private readonly AuthService _authService;

    public AccountController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        AuthService authService
    )
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager
            .Users
            .Include(u => u.Photos)
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null) return Unauthorized();

        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

        if (!result.Succeeded) return Unauthorized();

        return CreateUserDto(user);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await _userManager.FindByEmailAsync(registerDto.Email) != null)
        {
            ModelState.AddModelError("email", "Email is taken");
            return ValidationProblem(ModelState);
        }

        if (await _userManager.FindByNameAsync(registerDto.UserName) != null)
        {
            ModelState.AddModelError("userName", "Username is taken");
            return ValidationProblem(ModelState);
        }

        var user = new AppUser()
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.UserName,
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded) return BadRequest("Failed registering user");

        return CreateUserDto(user);
    }

    [HttpGet]
    public async Task<ActionResult<UserDto>> GetAuthenticatedUser()
    {
        var user = await _userManager.Users
            .Include(u => u.Photos)
            .FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));

        return CreateUserDto(user!);
    }

    private UserDto CreateUserDto(AppUser user)
    {
        return new UserDto()
        {
            Image = user.Photos.FirstOrDefault(p => p.IsMain)?.Url,
            Token = _authService.CreateToken(user),
            DisplayName = user.DisplayName!,
            UserName = user.UserName
        };
    }
}