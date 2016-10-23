package com.chequer.axboot.admin.domain.user.auth.menu;

import com.chequer.axboot.admin.domain.program.Program;
import lombok.Data;

import java.util.List;

@Data
public class AuthGroupMenuVO {

    private List<AuthGroupMenu> list;

    private Program program;
}
