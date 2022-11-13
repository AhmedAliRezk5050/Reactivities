using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Infrastructure.Email
{
  public class SendGridEmailSender : IEmailSender
  {
    private readonly IConfiguration _config;
    public SendGridEmailSender(IConfiguration config)
    {
      _config = config;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
      var sendGridKey = _config["Sendgrid:Key"];
      if (string.IsNullOrEmpty(sendGridKey))
      {
        throw new Exception("Null SendGridKey");
      }
      await Execute(sendGridKey, subject, message, toEmail);
    }

    public async Task Execute(string apiKey, string subject, string message, string toEmail)
    {
      var client = new SendGridClient(apiKey);
      var msg = new SendGridMessage()
      {
        From = new EmailAddress("ahmedalirezk5050@gmail.com", _config["Sendgrid:User"]),
        Subject = subject,
        PlainTextContent = message,
        HtmlContent = message
      };
      msg.AddTo(new EmailAddress(toEmail));

      msg.SetClickTracking(false, false);
      var response = await client.SendEmailAsync(msg);
    }
  }
}