using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace API.Controllers;

public class AccountController : BaseApiController
{
  private readonly UserManager<AppUser> _userManager;
  private readonly SignInManager<AppUser> _signInManager;
  private readonly AuthService _authService;
  private readonly IConfiguration _config;
  private readonly HttpClient _client;

  public AccountController(
      UserManager<AppUser> userManager,
      SignInManager<AppUser> signInManager,
      AuthService authService,
      IConfiguration config,
      HttpClient client
  )
  {
    _userManager = userManager;
    _signInManager = signInManager;
    _authService = authService;
    _config = config;
    _client = client;
    _client.BaseAddress = new Uri("https://graph.facebook.com/");
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

    await SetRefereshToken(user);

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

    await SetRefereshToken(user);

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

  [AllowAnonymous]
  [HttpPost("fbLogin")]
  public async Task<ActionResult<UserDto>> FacebookLogin([FromQuery] string accessToken)
  {
    var appId = _config["Facebook:AppId"];
    var appSecret = _config["Facebook:AppSecret"];
    var validAccessToken = $"{appId}|{appSecret}";

    var verifyToken =
        await _client.GetAsync($"debug_token?input_token={accessToken}&access_token={validAccessToken}");

    if (!verifyToken.IsSuccessStatusCode) return Unauthorized();

    var fbUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";

    var response = await _client.GetAsync(fbUrl);

    if (!response.IsSuccessStatusCode) return Unauthorized();

    var content = await response.Content.ReadAsStringAsync();

    var facebookUserDataDto = JsonConvert.DeserializeObject<FacebookUserDataDto>(content);

    if (facebookUserDataDto is null) return LoginFailureResponse();

    var user = await _userManager.Users
                                        .Include(u => u.Photos)
                                        .FirstOrDefaultAsync(u => u.Email
                                                == facebookUserDataDto.Email);

    if (user != null) return CreateUserDto(user);

    user = new AppUser
    {
      Email = facebookUserDataDto.Email,
      DisplayName = facebookUserDataDto.Name,
      UserName = facebookUserDataDto.Id,
      Photos = new List<Photo> {
        new Photo {
            Id = "fb" + facebookUserDataDto.Id,
            Url = facebookUserDataDto.Picture.Data.Url,
            IsMain = true
        }
      }
    };

    var result = await _userManager.CreateAsync(user);

    if (!result.Succeeded) return LoginFailureResponse();

    return CreateUserDto(user);
  }


  [HttpPost("refreshToken")]
  public async Task<ActionResult<UserDto>> RefreshToken()
  {
    var token = Request.Cookies["refreshToken"];

    var user = await _userManager.Users
    .Include(u => u.RefreshTokens)
    .Include(u => u.Photos)
    .FirstOrDefaultAsync(u => u.UserName == User.FindFirstValue(ClaimTypes.Name));

    if (user is null) return Unauthorized();

    var oldRefreshToken = user.RefreshTokens.FirstOrDefault(f => f.Token == token);

    if (oldRefreshToken != null && !oldRefreshToken.IsActive) return Unauthorized();

    return CreateUserDto(user);
  }

  private async Task SetRefereshToken(AppUser user)
  {
    var refreshToken = _authService.GenerateRefreshToken();
    user.RefreshTokens.Add(refreshToken);
    await _userManager.UpdateAsync(user);
    var cookieOptions = new CookieOptions
    {
      HttpOnly = true,
      Expires = DateTime.UtcNow.AddDays(7)
    };
    Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
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

  private ActionResult LoginFailureResponse()
  {
    ModelState.AddModelError("login_failure", "failed to login");
    return BadRequest(ModelState);
  }
}

