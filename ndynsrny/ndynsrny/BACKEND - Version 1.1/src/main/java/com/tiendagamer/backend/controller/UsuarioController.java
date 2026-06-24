package com.tiendagamer.backend.controller;

import com.tiendagamer.backend.model.Usuario;
import com.tiendagamer.backend.model.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El email ya está registrado"));
        }
        usuario.setRol("cliente");
        usuario.setFechaRegistro(LocalDateTime.now());
        Usuario guardado = usuarioRepository.save(usuario);
        guardado.setPassword(null);
        return ResponseEntity.ok(guardado);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String password = credenciales.get("password");
        Optional<Usuario> opt = usuarioRepository.findByEmail(email);
        if (opt.isEmpty() || !opt.get().getPassword().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }
        Usuario user = opt.get();
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public List<Usuario> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        usuarios.forEach(u -> u.setPassword(null));
        return usuarios;
    }

    @PutMapping("/{id}/rol")
    public ResponseEntity<?> actualizarRol(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Usuario no encontrado"));
        }
        String nuevoRol = body.get("rol");
        if (nuevoRol == null || (!nuevoRol.equals("admin") && !nuevoRol.equals("cliente"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Rol inválido"));
        }
        usuario.setRol(nuevoRol);
        usuarioRepository.save(usuario);
        usuario.setPassword(null);
        return ResponseEntity.ok(usuario);
    }
}
