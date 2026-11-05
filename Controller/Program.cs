using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseCors();

var assembly = typeof(Program).Assembly;
var embeddedProvider = new ManifestEmbeddedFileProvider(assembly, "UI");

app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = embeddedProvider });

app.UseStaticFiles(new StaticFileOptions { FileProvider = embeddedProvider });


app.MapControllers();

app.Lifetime.ApplicationStarted.Register(() =>
{
    try
    {
        System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
        {
            FileName = "http://localhost:5000",
            UseShellExecute = true
        });
    }
    catch
    {
    }
});

app.Run();
