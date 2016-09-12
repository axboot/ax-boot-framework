package com.chequer.axboot.admin.domain.program;

import com.chequer.axboot.admin.domain.user.auth.group.menu.AuthGroupMenu;
import com.chequer.axboot.admin.domain.user.auth.group.menu.AuthGroupMenuService;
import com.chequer.axboot.core.code.Params;
import com.chequer.axboot.core.domain.BaseService;
import com.chequer.axboot.core.utils.ArrayUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.inject.Inject;
import java.util.List;

@Service
public class ProgramService extends BaseService<Program, String> {

    private ProgramRepository programRepository;

    @Inject
    private AuthGroupMenuService authGroupMenuService;

    @Inject
    public ProgramService(ProgramRepository programRepository) {
        super(programRepository);
        this.programRepository = programRepository;
    }

    public Page<Program> searchProgram(String searchParam, PageRequest pageable) {
        Page<Program> programs;

        if (!StringUtils.isEmpty(searchParam)) {
            programs = programRepository.findByProgCdContainingOrProgNmContaining(searchParam, searchParam, pageable);
        } else {
            programs = programRepository.findAll(pageable);
        }
        return programs;
    }

    public List<Program> searchProgram(String searchParam) {
        List<Program> programs;
        if (!StringUtils.isEmpty(searchParam)) {
            programs = programRepository.findByProgCdContainingOrProgNmContaining(searchParam, searchParam);
        } else {
            programs = programRepository.findAll();
        }
        return programs;
    }

    public void saveAndCheckAuth(List<Program> programs) {
        for (Program program : programs) {
            if (StringUtils.isEmpty(program.getProgCd())) {
                program.setProgCd(FilenameUtils.getBaseName(program.getProgPh()));
            }

            List<AuthGroupMenu> authGroupMenuList = authGroupMenuService.findByMnuCd(program.getProgCd());

            if (!ArrayUtils.isEmpty(authGroupMenuList)) {
                for (AuthGroupMenu authGroupMenu : authGroupMenuList) {
                    String schAh = program.getSchAh();
                    String savAh = program.getSavAh();
                    String exlAh = program.getExlAh();
                    String fn1Ah = program.getFn1Ah();
                    String fn2Ah = program.getFn2Ah();
                    String fn3Ah = program.getFn3Ah();
                    String fn4Ah = program.getFn4Ah();
                    String fn5Ah = program.getFn5Ah();

                    authGroupMenu.setSchAh(schAh.equals(Params.N) ? Params.N : authGroupMenu.getSchAh());
                    authGroupMenu.setSavAh(savAh.equals(Params.N) ? Params.N : authGroupMenu.getSavAh());
                    authGroupMenu.setExlAh(exlAh.equals(Params.N) ? Params.N : authGroupMenu.getExlAh());
                    authGroupMenu.setFn1Ah(fn1Ah.equals(Params.N) ? Params.N : authGroupMenu.getFn1Ah());
                    authGroupMenu.setFn2Ah(fn2Ah.equals(Params.N) ? Params.N : authGroupMenu.getFn2Ah());
                    authGroupMenu.setFn3Ah(fn3Ah.equals(Params.N) ? Params.N : authGroupMenu.getFn3Ah());
                    authGroupMenu.setFn4Ah(fn4Ah.equals(Params.N) ? Params.N : authGroupMenu.getFn4Ah());
                    authGroupMenu.setFn5Ah(fn5Ah.equals(Params.N) ? Params.N : authGroupMenu.getFn5Ah());

                    authGroupMenuService.save(authGroupMenu);
                }
            }
        }
        save(programs);
    }
}
