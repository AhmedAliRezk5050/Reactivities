using Application.Interfaces;
using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Photos;

public class PhotoAccessor : IPhotoAccessor
{
    public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
    {
        throw new NotImplementedException();
    }

    public async Task<string> DeletePhoto(string publicId)
    {
        throw new NotImplementedException();
    }
}