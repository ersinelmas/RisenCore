package com.risencore.risencore_api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Hello Controller", description = "Endpoints for greeting users")
public class HelloController {

    @Operation (
            summary = "Say Hello",
            description = "Returns a simple greeting message from the RisenCore API."
    )
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello from RisenCore API!";
    }

    @Operation (
            summary = "Greet User",
            description = "Returns a personalized greeting message. You can provide a name as a query parameter."
    )
    @GetMapping("/greet")
    public String greet(@RequestParam(value = "name", defaultValue = "World") String name) {
        return String.format("Hello, %s! Welcome to RisenCore.", name);
    }
}