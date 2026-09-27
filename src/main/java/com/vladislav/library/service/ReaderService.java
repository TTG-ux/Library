package com.vladislav.library.service;

import com.vladislav.library.dto.ReaderDTO;
import com.vladislav.library.exception.DuplicateEmailException;
import com.vladislav.library.exception.ResourceNotFoundException;
import com.vladislav.library.models.Reader;
import com.vladislav.library.repository.ReaderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReaderService {
    private final ReaderRepository readerRepository;

    public List<ReaderDTO> getAllReaders() {
        return readerRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ReaderDTO getReaderById(Long id) {
        return toDTO(readerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Читатель", id)));
    }

    public ReaderDTO createReader(ReaderDTO dto) {
        readerRepository.findByEmail(dto.getEmail())
                .ifPresent(r -> { throw new DuplicateEmailException(dto.getEmail()); });

        Reader reader = toEntity(dto);
        reader.setRegistrationDate(LocalDate.now());
        return toDTO(readerRepository.save(reader));
    }

    public ReaderDTO updateReader(Long id, ReaderDTO dto) {
        Reader reader = readerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Читатель", id));

        if (!reader.getEmail().equals(dto.getEmail()))
            readerRepository.findByEmail(dto.getEmail())
                    .ifPresent(r -> { throw new DuplicateEmailException(dto.getEmail()); });

        reader.setFirstName(dto.getFirstName());
        reader.setLastName(dto.getLastName());
        reader.setEmail(dto.getEmail());
        reader.setPhone(dto.getPhone());

        return toDTO(readerRepository.save(reader));
    }

    public void deleteReader(Long id) {
        Reader reader = readerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Читатель", id));
        readerRepository.delete(reader);
    }

    private ReaderDTO toDTO(Reader r) {
        return ReaderDTO.builder().id(r.getId()).firstName(r.getFirstName())
                .lastName(r.getLastName()).email(r.getEmail()).phone(r.getPhone())
                .registrationDate(r.getRegistrationDate()).build();
    }

    private Reader toEntity(ReaderDTO d) {
        return Reader.builder().id(d.getId()).firstName(d.getFirstName())
                .lastName(d.getLastName()).email(d.getEmail()).phone(d.getPhone())
                .registrationDate(d.getRegistrationDate()).build();
    }
}
