package com.chequer.axboot.core.domain.manual;

import com.chequer.axboot.core.domain.BaseService;
import com.chequer.axboot.core.parameter.RequestParams;
import com.querydsl.core.BooleanBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;


@Service
public class ManualService extends BaseService<Manual, Long> {
    private ManualRepository manualRepository;

    @Inject
    public ManualService(ManualRepository manualRepository) {
        super(manualRepository);
        this.manualRepository = manualRepository;
    }

    public List<Manual> get(RequestParams requestParams) {
        String manualGrpCd = requestParams.getString("manualGrpCd", "");
        boolean menuOpen = requestParams.getBoolean("menuOpen", true);

        BooleanBuilder builder = new BooleanBuilder();

        if (isNotEmpty(manualGrpCd)) {
            builder.and(qMenual.manualGrpCd.eq(manualGrpCd));
        }

        List<Manual> manualList = select().from(qMenual).where(builder).orderBy(qMenual.level.asc(), qMenual.sort.asc()).fetch();

        List<Manual> hierarchyList = new ArrayList<>();

        for (Manual manual : manualList) {
            manual.setOpen(menuOpen);

            Manual parent = getParent(hierarchyList, manual);

            if (parent == null) {
                hierarchyList.add(manual);
            } else {
                parent.addChildren(manual);
            }
        }

        return hierarchyList;
    }

    public Manual getParent(List<Manual> manuals, Manual manual) {
        Manual parent = manuals.stream().filter(m -> m.getId().equals(manual.getParentId())).findAny().orElse(null);

        if (parent == null) {
            for (Manual _manual : manuals) {
                parent = getParent(_manual.getChildren(), manual);

                if (parent != null)
                    break;
            }
        }
        return parent;
    }

    @Transactional
    public void processManual(ManualRequestVO vo) {
        saveMenu(vo.getList());
        deleteManual(vo.getDeletedList());
    }

    @Transactional
    public void saveMenu(List<Manual> manuals) {
        save(manuals);
        manuals.stream().filter(manual -> isNotEmpty(manual.getChildren())).forEach(menu -> {
            menu.getChildren().forEach(m -> m.setParentId(menu.getId()));
            saveMenu(menu.getChildren());
        });
    }

    @Transactional
    public void deleteManual(List<Manual> manuals) {
        delete(manuals);
        manuals.stream().filter(menu -> isNotEmpty(menu.getChildren())).forEach(menu -> {
            deleteManual(menu.getChildren());
        });
    }
}
