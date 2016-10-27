package ${basePackage}.domain.manual;

import lombok.Data;

import java.util.List;

@Data
public class ManualRequestVO {

    private List<Manual> list;

    private List<Manual> deletedList;
}
