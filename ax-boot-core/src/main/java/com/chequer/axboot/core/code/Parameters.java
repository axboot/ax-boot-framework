package com.chequer.axboot.core.code;

public class Parameters {

    public static final String COMP_CD = "compCd";
    public static final String STOR_CD = "storCd";
    public static final String USER_CD = "userCd";
    public static final String USER_NM = "userNm";
    public static final String USER_TYPE = "userType";

    public static final String CSMS_ITEM_CD = "csmsItemCd";
    public static final String CSMS_ITEM_NM = "csmsItemNm";

    public static final String BCAT_CD = "bcatCd";
    public static final String HCAT_CD = "hcatCd";
    public static final String MCAT_CD = "mcatCd";
    public static final String LCAT_CD = "lcatCd";
    public static final String ITEM_MAP_CD = "itemMapCd";
    public static final String HCAT_NM = "hcatNm";
    public static final String MCAT_NM = "mcatNm";
    public static final String LCAT_NM = "lcatNm";
    public static final String ITEM_MAP_NM = "itemMapNm";
    public static final String ITEM_NM = "itemNm";
    public static final String APPLY_YN = "applyYn";
    public static final String USE_YN = "useYn";
    public static final String ST_DT = "stDt";
    public static final String END_DT = "endDt";
    public static final String DISP_YN = "dispYn";
    public static final String POS_YN = "posYn";
    public static final String ALL = "ALL";
    public static final String MENU_FG = "menuFg";

    public static final String ITEM_CD = "itemCd";
    public static final String NEW_PRICE = "newPrice";

    public static final String DN_FG_N = "N";
    public static final String UN_SEQ = "upSeq";
    public static final String SEQ = "seq";
    public static final String FILE_TY = "fileTy";
    public static final String FILE_NM = "fileNm";
    public static final String DN_PATH = "dnPath";
    public static final String SETUP_TY = "setupTy";
    public static final String SETUP_COM = "setupCom";
    public static final String VER = "ver";

    public static final String Y = "Y";
    public static final String N = "N";
    public static final String DEL_YN = "delYn";

    public static final String STATUS = "status";

    public static final String APRO_TY = "aproTy";

    public static final String BSNS_CD = "bsnsCd";

    public static final String APRO_TY_D = "D";         // 삭제
    public static final String APRO_TY_U = "U";         // 수정
    public static final String APRO_TY_N = "N";         // 신규

    public static final String APRO_STATUS_WAIT = "W";
    public static final String APRO_STATUS_REJECTED = "R";
    public static final String APRO_STATUS_APPROVED = "A";
    public static final String APRO_STATUS_CANCELED = "C";

    public static final String CREATED_AT = "createdAt";
    public static final String INS_DT = "insDt";

    public static final String IIAC_HCAT_CD = "iiacHcatCd";
    public static final String IIAC_MCAT_CD = "iiacMcatCd";
    public static final String IIAC_LCAT_CD = "iiacLcatCd";

    public static final String IIAC_HPOOM_CD = "iiacHpoomCd";
    public static final String IIAC_MPOOM_CD = "iiacMpoomCd";
    public static final String IIAC_LPOOM_CD = "iiacLpoomCd";

    public static String like(String field) {
        return String.format("%%%s%%", field);
    }
}
