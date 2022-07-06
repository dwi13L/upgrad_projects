package dev.wi13l.apigateway.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CustomErrorController implements ErrorController {
    // @GetMapping({ /* "/error", "/", */ "/{*}" })
    // public ResponseEntity<String> customErrorHandler() {
    // return new ResponseEntity<>("", HttpStatus.FORBIDDEN);
    // }
}
