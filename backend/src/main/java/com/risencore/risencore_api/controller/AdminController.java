package com.risencore.risencore_api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @GetMapping("/hello")
    public ResponseEntity<String> sayHelloToAdmin() {
        return ResponseEntity.ok("Hello, Admin!");
    }
}