using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseCors();

// путь к папке UI
var uiPath = Path.Combine(builder.Environment.ContentRootPath, "..", "UI");
var fileProvider = new PhysicalFileProvider(uiPath);

// localhost:5000 - открытие index.html
app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = fileProvider });

// раздача статики
app.UseStaticFiles(new StaticFileOptions { FileProvider = fileProvider });

app.MapControllers();

// Автоматическое открытие браузера при старте
if (app.Environment.IsDevelopment())
{
    app.Lifetime.ApplicationStarted.Register(() =>
    {
        System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
        {
            FileName = "http://localhost:5000",
            UseShellExecute = true
        });
    });
}

app.Run();
