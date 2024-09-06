package org.example.applicationcmdb.controller;


import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.applicationcmdb.dto.AuthenticationRequest;
import org.example.applicationcmdb.dto.UserReccord;
import org.example.applicationcmdb.entity.RoleType;
import org.example.applicationcmdb.entity.User;
import org.example.applicationcmdb.service.AuthService;
import org.example.applicationcmdb.service.LogoutService;
import org.example.applicationcmdb.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "*")
@Controller
@RequiredArgsConstructor
public class UserController {
    @Resource
    private UserService userService;

    @Resource
    private final AuthService service;
    @Resource
    private final LogoutService logoutService;

    @Resource
    private LogoutHandler logoutHandler;
    @PostMapping("/logouts")
    @ResponseBody
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        logoutService.logout(request, response, null); // Pass null for authentication as it's not used in logout

    }
    /******************* get all roleType ******************/
    @GetMapping("getroles")
    @ResponseBody
    public List<RoleType> getAllroles()
    {
        return RoleType.getAllRoleTypes();
    }
    /******************* get all classType ******************/


    @GetMapping("/user/me")
    @ResponseBody
    public User getConnectedUser()
    {
        System.out.println("Connected User Is : "+ userService.getConnectedUser());
        return userService.getConnectedUser();
    }


    @PostMapping(value = "register")

    public ResponseEntity<?> register(@RequestBody UserReccord user)
    {
        User newUser=new User();
        newUser.setLastName(user.getLastName());
        newUser.setFirstName(user.getFirstName());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());


        boolean test=userService.findByEmail(newUser.getEmail());
        if (test)
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(test);
        }
        else
        {
            var response=userService.register(newUser);
                return ResponseEntity.accepted().build();

        }
    }

/**** request email to enable the new acount created ****/
    /******** this api is sent in the mail sent and not used in the front end *******/
//    @GetMapping("register/verify")
//    public String verifyCustomer(@RequestParam(required = false) String token)
//    {
//        userService.verifyUser(token);
//        return "verifSuccess";
//    }



    /************************ login api ***********************/
    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request)
    {
        System.out.println(request);
        if (!userService.findByEmail(request.getEmail()))
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        else
        {
            User user =userService.getByEmail(request.getEmail());
            if(!user.isEnabled())
            {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User disabled");
            }
            else
                return ResponseEntity.ok(service.authenticate(request));
        }
    }

    /********************* resent activation email if the token is expired and user still disabled using the email set in the login page *****************/
//    @GetMapping("register/resendToken")
//    public ResponseEntity<?>resendtokenToActiveAcount(@RequestParam("email") String email)
//    {
//        userService.resendToken(email);
//        return ResponseEntity.ok().body("{\"message\": \"email sent\"}");
//
//    }
/********* these 2 methodes are for forget password ***************/

    /**** the email used to set the new password for the required user******/

    /**************** methode1:send email request for the forgot password ****************************/
//    @GetMapping("login/forgotPassword")
//    public ResponseEntity<?>sendForgotPassword(@RequestParam("email") String email)
//    {
//        if( userService.sendForgotPasswordRequest(email))
//        { sentmail=email;
//
//            return ResponseEntity.accepted().build();
//        }
//        else
//            return ResponseEntity.notFound().build();
//    }
    /************************ methode2:set the new password tapped by the user **************/
//    @PatchMapping("login/setnewpassword")
//    public  ResponseEntity<?> setNewPassword( @RequestBody ForgotPasswordRequest request)
//    {
//        if(userService.setForgotPassword( request))
//        {   return ResponseEntity.accepted().build();}
//        else
//            return ResponseEntity.notFound().build();
//    }
//    /***************** verify the code tapped by the user in the double authentication while login *************/
//    /*********** the code is linked with the qr code scanned while registring *********************/
//    @PostMapping("login/verify")
//    public ResponseEntity<?> verifyCode(@RequestBody VerificationRequest verificationRequest)
//    {
//        return ResponseEntity.ok(service.verifyCode(verificationRequest));
//    }


    /* @PostMapping("/refresh-token")
     public void refreshToken(
             HttpServletRequest request,//the object where we can get or read the authorization header which will hold the refresh token
             HttpServletResponse response//the object that will help us to re-inject or to send back the response
     ) throws IOException {
         service.refreshToken(request,response);
     }*/

    /*********************** get user status:enabled or not *******************/
    @GetMapping("getenabled")
    @ResponseBody
    public  boolean getEnabled( @RequestParam ("email") String email)
    {     User user = userService.getByEmail(email);
        return  user.isEnable();
    }

}




