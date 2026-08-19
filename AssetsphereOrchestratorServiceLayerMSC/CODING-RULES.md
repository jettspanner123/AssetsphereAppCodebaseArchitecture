# Coding Rules

## General

- (e.g. Use as much code splitting, into components or controller as you can, the code space must be need and clean).
- (e.g. Always use singleon pattern. (when possible))

  ```csharp
  // Defination
    public sealed class Singleton {
        private static readonly Singleton _current = new Singleton();
        public static Singleton Current => _current;

        private Singleton() {

        }
        public void SayHello() {
            // SOmething here
        }
    }
  // Useage
  Sinleton.Instance.SayHello();
  ```

- Everything should be fully typed:
  ```csharp
    string name = "Jett";
    int age = 25;
    double height = 6.1;
    float weight = 90.5f;
    bool isActive = true;
    char grade = 'A';
    decimal price = 99.99m;
    long population = 1_000_000L;
  ```

## File Structure

- (e.g. All enums, structs, interfaces, and classes used for data transfer, state options, or data representations must be stored in the `app/Features/${folderName}/Models/` folder inside each feature, and the file name should be in PascalCase.)
- (e.g. Every features folder should have some files, if the name of the folder is `Features/Authentication`, then this is the files / folder it should have.)
  Controller: `Features/Authentication/AuthenticationController.cs`
  Service Folder: `Features/Authentication/Services/AuthenticationService.cs`
  Constants Folder: `Features/Authentioation/Constants`
  Models Folder: `Features/Authentication/Models`
  Utils Folder: `Features/Authentication/Utilities`
- (e.g. If a feature specific files/class/utility/tool is created, then it should be in a folder inside the feature only, but if a tool/class/type/interface/function/util is create that will be used in more then one feature then it should be place in one of these global folders )
  Global Service Folder: `Service/`
        - All the files names should be Pascal Case and should end with `*Service.cs`.
  Global Constants Folder: `Constants/`
        - All the files names should be Pascal Case and should end with `*CON.cs`.
  Global Models Folder: `Models/`
    - Global Interface Folder: `Models/Interfaces/`
        - All the files names should be Pascal Case and should end with `*Interface.cs`.
    - Global Types Folder: `Models/Types/`
        - All the files names should be Pascal Case and should end with `*Type.cs`.
    - Global DTOs Folder: `Models/DTOs/`
        - All the files names should be Pascal Case and should end with `*DTO.cs`.
    - Global Classes Folder: `Models/Classes/`
        - All the files names should be Pascal Case and should end with `*Class.cs`.
    - Global Records Folder: `Models/Records/`
        - All the files names should be Pascal Case and should end with `*Record.cs`.
  Global Utils Folder: `Utilities/`
        - All the files names should be Pascal Case and should end with `*Utility.cs`.
  Global Utils Folder: `Middlewares/`
        - All the files names should be Pascal Case and should end with `*Middleware.cs`.
  Global Helper Folder: `Helpers/`
        - All the files names should be Pascal Case and should end with `*Helper.cs`.
        - All the classes in these files should follow singleton pattern.
  Global Helper Folder: `Exceptions/`
        - All the files names should be Pascal Case and should end with `*CException.cs`.
  Global Helper Folder: `Validators/`
        - All the files names should be Pascal Case and should end with `*CValidator.cs` if it's a custom validator and `*SValidator.cs` if it's system validator.
        - Each validator class should be singleton, and should have only one function `validate()`, it should always return true | false ( nothing else ).
        - Each validation class should do only one type of validation.
        ```csharp

            // Defination
           public sealed class AgeSValidator {
               private static readonly Singleton _current = new Singleton();
               public static Singleton Current => _current;

               private Singleton() {

               }
               public bool Validate() {
                    // SOmething here
               } 
           } 


           // Usage

           if(AgeSValidator.Current.Validate(18)) // Do Something
        ```

 ```

## Strict Rules

- Nothing should be staticaly typed anywhere in the files.
- If a route endpoint is defined, the it should be like this `/Authentication/Login` as a simple string, it should be stored in a class.
```csharp

    // Wrong 
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
        }
    }

    // Right
    [ApiController]
    [Route(ApplicationRouteFactor.Current.Authentication.ControllerURL)]
    public class UserController : ControllerBase
    {
        [HttpPost(ApplicationRouteFactor.Current.Authentication.Login)]
        public IActionResult Login([FromBody] LoginRequest request)
        {
        }
    }

    // Declaration
    public sealed class ApplicationRouteFactory
    {
        private static readonly ApplicationRouteFactory _current =
            new ApplicationRouteFactory();

        public static ApplicationRouteFactory Current => _current;

        private ApplicationRouteFactory()
        {
        }

        public AuthenticationRoutes Authentication { get; } = new();

        public sealed class AuthenticationRoutes
        {
            public string ControllerURL { get; } = "Api/V1/Authentication";
            public string Login { get; } = "Login";
        }
    }
```
- This `ApplicationRouteFactor.cs` should be in the global `Factories/` folder please.