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

app.Run();
