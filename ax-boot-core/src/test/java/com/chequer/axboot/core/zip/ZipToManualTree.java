package com.chequer.axboot.core.zip;

import com.chequer.axboot.core.domain.manual.Manual;
import com.chequer.axboot.core.domain.manual.ManualService;
import org.apache.commons.io.FileUtils;
import org.junit.Test;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;
import org.zeroturnaround.zip.ZipUtil;

import javax.inject.Inject;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ZipToManualTree {

    @Inject
    private ManualService manualService;

    @Test
    public void zip() throws IOException {
        ZipUtil.unpack(new File("/Users/brant/Desktop/manual.zip"), new File("/Users/brant/Desktop/test"));
        List<Manual> manuals = new ArrayList<>();
    }

    @Transactional
    @Rollback(false)
    public void test(List<Manual> manualList, File[] files, int level, Long parentId) throws IOException {
        int sort = 0;
        for (File file : files) {
            if (file != null && !file.getName().startsWith(".") && !file.getName().startsWith("__")) {
                Manual manual = new Manual();
                manual.setManualNm(file.getName());
                manual.setSort(sort++);
                manual.setLevel(level);
                manual.setParentId(parentId);

                manualService.save(manual);
                manualList.add(manual);

                if (file.isDirectory()) {
                    test(manual.getChildren(), file.listFiles(), level + 1, manual.getId());
                } else {
                    manual.setContent(FileUtils.readFileToString(file, "UTF-8"));
                    manualService.save(manual);
                }
            }
        }
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

}
