package org.example.applicationcmdb.service;


import jakarta.annotation.Resource;
import org.example.applicationcmdb.dto.AuthenticationResponse;
import org.example.applicationcmdb.entity.User;
import org.example.applicationcmdb.filter.JwtService;
import org.example.applicationcmdb.repo.UserRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Service
public class UserService {
    @Resource
    private UserRepo userRepository;
    @Resource
    private PasswordEncoder passwordEncoder;



    @Resource
    private AuthService authService;
    @Resource
    private JwtService jwtService;


    @Value("${site.base.url.https}")
    private String baseURL;

    /************************ register user implement *****************/

    public AuthenticationResponse register(User user)  {


        System.out.println(user);
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);
        if (user.getEmail() != null && user.getEmail().contains(".") && user.getEmail().contains("@")) {
            user.setEnable(true);}
        var savedUser = userRepository.save(user);
//        if (user.getEmail() != null && user.getEmail().contains(".") && user.getEmail().contains("@")) {
//            sendRegistrationConfirmationEmail(user);}
        // generate  a jwt key to authorize the rest of api
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        authService.saveUserToken(savedUser, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken).build();

    }


/******************* activating the user by this methode ***********************/
    /***************** this methode is inside the api that is sent to the user in anb email **********/




    /********************* these 3 methodes  are dedicated to  change a new email*****************************/

    /***********methode1:send a verification email(we didn't use the same methode wish is for activating the user
     * because this methode will use another verification email wish will set the new user email

    /******************* methode2: set the new email and generate a new token with the new email*************/
    /************ this methode is called in api sent with the virification email and not used as a front api *********/



    /*********************** change password methode implement *********************/
//    public void changePassword(ChangePasswordRequest request) {
//
//        var user = (User)   userRepository.findByEmail(request.getEmail()).orElseThrow();
//
//        // check if the current password is correct
//        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
//            throw new IllegalStateException("Wrong password");
//        }
//        // check if the two new passwords are the same
//        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
//            throw new IllegalStateException("Passwords are not the same");
//        }
//
//        // update the password
//        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
//
//        // save the new password
//        userRepository.save(user);
//    }
    /********************** these 2 methodes are for users who forgot their passwords*******************/
    /********************methode1:get the email from the user and send a forgot password email request ****************/


//    public boolean sendForgotPasswordRequest(String email)
//    {
//        SecureToken secureToken= secureTokenService.createSecureToken();
//        var userOptional = userRepository.findByEmail(email);
//        if (userOptional.isPresent())
//        {
//            // setting the email of the use wish  i will change his password
//            pwdEmail=email;
//            User user = userOptional.get();
//            secureToken.setUser(user);
//            secureTokenRepository.save(secureToken);
//            ForgotPasswordEmailContext emailContext = new ForgotPasswordEmailContext();
//            emailContext.init(user);
//            emailContext.setToken(secureToken.getToken());
//            //an url will be sent with the email and this url will have the base url front end and not backend
//            String base="http://localhost:4200";
//            emailContext.buildForgotPasswordUrl(base, secureToken.getToken());
//            try {
//                emailService.sendMail(emailContext);
//            } catch (MessagingException e) {
//                e.printStackTrace();
//            }
//            return true;
//        }else
//        {
//            return false;
//        }
//    }
    /**********************methode2: user set the new password and saves it ***********************/

//    public boolean setForgotPassword(ForgotPasswordRequest request)
//    {
//        var userOptional = userRepository.findByEmail(pwdEmail);
//        if (userOptional.isPresent())
//        {
//            User user = userOptional.get();
//            if (!request.getNewPassword().equals(request.getConfirmPassword()))
//            {
//                throw new IllegalStateException("Password are not the same");
//            }
//            // update the password
//            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
//            // save the new password
//            userRepository.save(user);
//            return true;
//        }
//        return false;
//    }
    /********************* find by email methode implement(check if user exists or not ******************************/
    public boolean findByEmail(String email)
    {
        var user= userRepository.findByEmail(email);
        if(user.isPresent())
        {
            return true;
        }
        return false;
    }
    /********************* get the user by his email *******************/
    public User getByEmail(String email)
    {
        var user= userRepository.findByEmail(email)  ;
        return  user.get();
    }

    /******************* update user personal infos methode implement **********************/
//    public  AuthenticationResponse changePersonalInfos(ChangePersonalInfosdRequest request, Principal connectedUser)
//    {
//        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
//        user.setFirstName(request.getFirstName());
//        user.setLastName(request.getLastName());
//        user.setBirthDate(request.getBirthDate());
//        ClassType classType = ClassType.valueOf(request.getClassType());
//        user.setClassType(classType);
//        var saveduser = userRepository.save(user);
//        var jwtToken = jwtService.generateToken(user);
//        var refreshToken = jwtService.generateRefreshToken(user);
//        authService.updateToken(saveduser, jwtToken);
//        return AuthenticationResponse.builder()
//
//                .accessToken(jwtToken)
//
//                .refreshToken(refreshToken).build();
//
//
//    }

    public User getConnectedUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        User connectedUser=null;
        if(principal instanceof UserDetails){
            UserDetails userDetails = (UserDetails) principal;
            connectedUser=this.getByEmail(userDetails.getUsername());
        }
        System.out.println("HELLO");
        System.out.println(principal);
        return connectedUser;

    }

    public User findUserById(Long id) {
        if(id!= null)
        {
            final Optional<User> optionalUser= userRepository.findById(id);
            if (optionalUser.isPresent())
            {
                return optionalUser.get();
            }
        }
        return null;
    }
}






