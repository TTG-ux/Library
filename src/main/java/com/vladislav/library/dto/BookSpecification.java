package com.vladislav.library.dto;

import com.vladislav.library.models.Book;
import org.springframework.data.jpa.domain.Specification;

public class BookSpecification {

    public static Specification<Book> hasTitle(String title) {
        return (root, query, cb) ->
                title == null ? null : cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    public static Specification<Book> hasAuthor(String author) {
        return (root, query, cb) ->
                author == null ? null : cb.like(cb.lower(root.get("author")), "%" + author.toLowerCase() + "%");
    }

    public static Specification<Book> hasIsbn(String isbn) {
        return (root, query, cb) ->
                isbn == null ? null : cb.equal(root.get("isbn"), isbn);
    }

    public static Specification<Book> hasPublicationYear(Integer year) {
        return (root, query, cb) ->
                year == null ? null : cb.equal(root.get("publicationYear"), year);
    }

    public static Specification<Book> isAvailable(Boolean available) {
        return (root, query, cb) ->
                available == null ? null :
                        (available ? cb.gt(root.get("availableCopies"), 0) : cb.equal(root.get("availableCopies"), 0));
    }
}
