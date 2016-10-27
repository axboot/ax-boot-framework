package ${basePackage}.domain.manual;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class ManualListVO {

    private Long manualId;
    private String manualGrpCd;
    private String manualNm;
    private Long parentId;
    private Integer level;
    private Integer sort;
    private String key;
    private String manualKey;
    private boolean open = false;

    private List<ManualListVO> children = new ArrayList<>();

    @JsonProperty("name")
    public String label() {
        return manualNm;
    }

    @JsonProperty("id")
    public Long id() {
        return manualId;
    }

    @JsonProperty("open")
    public boolean isOpen() {
        return open;
    }
}
