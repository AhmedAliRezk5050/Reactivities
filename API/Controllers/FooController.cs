using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class FooController : BaseApiController
{
  private readonly IWebHostEnvironment _webHostEnvironment;

  public FooController(IWebHostEnvironment webHostEnvironment)
  {
    _webHostEnvironment = webHostEnvironment;
  }


  [HttpPost]
  public async Task<string> UploadImage(IFormFile formFile)
  {

    string? uniqueFileName = UploadedFile(formFile);
    return Path.Join("/images", uniqueFileName);
  }

  private string UploadedFile(IFormFile formFile)
  {
    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
    var uniqueFileName = Guid.NewGuid().ToString() + "_" + formFile.FileName;
    string filePath = Path.Combine(uploadsFolder, uniqueFileName);
    using (var fileStream = new FileStream(filePath, FileMode.Create))
    {
      formFile.CopyTo(fileStream);
    }

    return uniqueFileName;
  }
}