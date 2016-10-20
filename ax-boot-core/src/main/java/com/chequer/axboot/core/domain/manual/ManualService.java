package com.chequer.axboot.core.domain.manual;

import com.chequer.axboot.core.domain.BaseService;
import com.chequer.axboot.core.domain.file.CommonFile;
import com.chequer.axboot.core.domain.file.CommonFileService;
import com.chequer.axboot.core.parameter.RequestParams;
import com.querydsl.core.BooleanBuilder;
import org.apache.commons.io.FileUtils;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.zeroturnaround.zip.ZipUtil;

import javax.inject.Inject;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;


@Service
public class ManualService extends BaseService<Manual, Long> {
    private ManualRepository manualRepository;

    @Inject
    private CommonFileService commonFileService;

    @Inject
    public ManualService(ManualRepository manualRepository) {
        super(manualRepository);
        this.manualRepository = manualRepository;
    }

    public List<Manual> get(RequestParams<Manual> requestParams) {
        String manualGrpCd = requestParams.getString("manualGrpCd", "");
        boolean menuOpen = requestParams.getBoolean("menuOpen", true);

        BooleanBuilder builder = new BooleanBuilder();

        if (isNotEmpty(manualGrpCd)) {
            builder.and(qManual.manualGrpCd.eq(manualGrpCd));
        }

        List<Manual> manualList = select().from(qManual).where(builder).orderBy(qManual.level.asc(), qManual.sort.asc()).fetch();

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
                manual.setManualNm(exist.getManualNm());
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

    @Transactional
    public Manual uploadFile(Long id, MultipartFile file) throws IOException {
        CommonFile commonFile = commonFileService.upload(file, "MANUAL", Long.toString(id), 1);

        Manual manual = findOne(id);
        try {
            manual.setFileId(commonFile.getId());
            save(manual);
        } catch (Exception e) {
            // ignore
        }
        return manual;
    }

    @Transactional
    public void uploadList(String manualGrpCd, InputStream inputStream) throws IOException, InvalidFormatException {
        Workbook workbook = WorkbookFactory.create(inputStream);
        Sheet sheet = workbook.getSheetAt(0);

        List<Manual> manualList = new ArrayList<>();

        String level1Name = "";
        String level2Name = "";
        String level3Name = "";

        for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
            Row row = sheet.getRow(rowIndex);
            String _level1Name = getString(row.getCell(0));
            String _level2Name = getString(row.getCell(1));
            String _level3Name = getString(row.getCell(2));
            String callKey = getString(row.getCell(3));

            if (!level1Name.equals(_level1Name) && isNotEmpty(_level1Name)) {
                level1Name = _level1Name;
                Manual manual = new Manual();
                manual.setLevel(0);
                manual.setManualNm(_level1Name);
                manual.setManualGrpCd(manualGrpCd);
                manual.setManualKey(callKey);

                manualList.add(manual);
            }

            if (!level2Name.equals(_level2Name) && isNotEmpty(_level2Name)) {
                level2Name = _level2Name;
                Manual parent = getParent(manualList, level1Name);

                if (parent != null) {
                    Manual manual = new Manual();
                    manual.setLevel(1);
                    manual.setManualNm(_level2Name);
                    manual.setManualGrpCd(manualGrpCd);
                    manual.setManualKey(callKey);

                    parent.addChildren(manual);
                }
            }

            if (!level3Name.equals(_level3Name) && isNotEmpty(_level3Name)) {
                level3Name = _level2Name;
                Manual parent = getParent(manualList, level2Name);

                if (parent != null) {
                    Manual manual = new Manual();
                    manual.setLevel(2);
                    manual.setManualNm(_level3Name);
                    manual.setManualGrpCd(manualGrpCd);
                    manual.setManualKey(callKey);

                    parent.addChildren(manual);
                }
            }
        }

        delete(qManual).where(qManual.manualGrpCd.eq(manualGrpCd)).execute();

        process(manualList);
    }

    public Manual getParent(List<Manual> manualList, String manualNm) {
        Manual parent = manualList.stream().filter(m -> m.getManualNm().equals(manualNm)).findAny().orElse(null);

        if (parent == null) {
            for (Manual _manual : manualList) {
                parent = getParent(_manual.getChildren(), manualNm);

                if (parent != null)
                    break;
            }
        }

        return parent;
    }

    public String getString(Cell cell) {
        if (cell == null) {
            return "";
        }

        switch (cell.getCellType()) {
            case Cell.CELL_TYPE_BLANK:
                return "";

            case Cell.CELL_TYPE_BOOLEAN:
                return Boolean.toString(cell.getBooleanCellValue());

            case Cell.CELL_TYPE_ERROR:
                return "";

            case Cell.CELL_TYPE_STRING:
                return cell.getStringCellValue();

            case Cell.CELL_TYPE_NUMERIC:
                return Integer.toString((int) cell.getNumericCellValue());

            case Cell.CELL_TYPE_FORMULA:
                return cell.getCellFormula();
        }

        return "";
    }

    public Manual getManual(Long id) {
        Manual manual = findOne(id);

        if (manual.getFileId() != null) {
            manual.setFile(commonFileService.get("MANUAL", Long.toString(id)));
        }

        return manual;
    }

    public void pdfToImage() {

    }
}
