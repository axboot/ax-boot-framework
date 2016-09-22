package com.chequer.axboot.core.domain.manual;

import com.chequer.axboot.core.domain.BaseService;
import com.chequer.axboot.core.parameter.RequestParams;
import com.querydsl.core.BooleanBuilder;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zeroturnaround.zip.ZipUtil;

import javax.inject.Inject;
import java.io.File;
import java.io.IOException;
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

    @Transactional
    public void uploadZip(File zip, String manualGrpCd) throws IOException {
        List<Manual> manuals = new ArrayList<>();
        File destFile = File.createTempFile("upload_", Long.toString(System.nanoTime()));
        ZipUtil.unpack(zip, destFile);
        dirToManualList(manuals, destFile.listFiles(), 0, null, manualGrpCd);
    }

    @Transactional
    public void dirToManualList(List<Manual> manualList, File[] files, int level, Long parentId, String manualGrpCd) throws IOException {
        int sort = 0;
        for (File file : files) {
            if (isValidDirOrFile(file)) {
                Manual manual = new Manual();
                manual.setManualNm(file.getName());
                manual.setSort(sort++);
                manual.setLevel(level);
                manual.setParentId(parentId);
                manual.setManualGrpCd(manualGrpCd);

                save(manual);
                manualList.add(manual);

                if (file.isDirectory()) {
                    dirToManualList(manual.getChildren(), file.listFiles(), level + 1, manual.getId(), manualGrpCd);
                } else {
                    manual.setContent(FileUtils.readFileToString(file, "UTF-8"));
                    save(manual);
                }
            }
        }
    }

    public boolean isValidDirOrFile(File file) {
        return file != null && !file.getName().startsWith(".") && !file.getName().startsWith("__");
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
    public void saveOrDelete(ManualRequestVO vo) {
        process(vo.getList());
        deleteManual(vo.getDeletedList());
    }

    @Transactional
    public void update(List<Manual> manuals) {
        manuals.forEach(manual -> {
            if (!manual.isNew()) {
                Manual exist = findOne(manual.getId());
                manual.setManualKey(exist.getManualKey());
                manual.setContent(exist.getContent());
            }

            save(manual);
        });
    }

    @Transactional
    public void process(List<Manual> manuals) {
        manuals.stream().filter(manual -> manual.getLevel() == 0).forEach(manual -> manual.setParentId(null));
        update(manuals);

        manuals.stream().filter(manual -> isNotEmpty(manual.getChildren())).forEach(menu -> {
            menu.getChildren().forEach(m -> m.setParentId(menu.getId()));
            process(menu.getChildren());
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
