var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(); //вкл поддержку классов-контроллера 
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyMethod()));

var app = builder.Build();

app.UseCors(); //разрешаем ходить с одного адреса на наш сервер
app.UseStaticFiles(); //отдавал HTML/CSS/JS
app.MapControllers();


app.Run();
