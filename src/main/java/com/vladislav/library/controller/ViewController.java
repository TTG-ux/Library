package com.vladislav.library.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String index() {
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin";
    }

    @GetMapping("/reader")
    public String reader() {
        return "reader";
    }

    @GetMapping("/add-book")
    public String addBook() {
        return "add-book";
    }

    @GetMapping("/add-reader")
    public String addReader() {
        return "add-reader";
    }

    @GetMapping("/search-books")
    public String searchBooks() {
        return "search-books";
    }

    @GetMapping("/loan-return")
    public String loanReturn() {
        return "loan-return";
    }
}
