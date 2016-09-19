package com.chequer.axboot.core.domain.user.auth.menu;

import com.chequer.axboot.core.domain.program.Program;
import lombok.Data;

import java.util.List;

@Data
public class AuthGroupMenuVO {

    private List<AuthGroupMenu> list;

    private Program program;
}
