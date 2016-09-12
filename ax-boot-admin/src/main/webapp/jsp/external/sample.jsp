<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>
<%

%>
<ax:layout name="blank.jsp">
    <ax:div name="header">

    </ax:div>
    <ax:div name="contents">

        <div class="ax-body">
            <div class="ax-wrap" style="max-width:700px;_width:700px;">
                <div style="height:50px;"></div>
                <div class="ax-layer cx-content-layer">
                    <div class="ax-col-12 ax-content expand">
                        <!-- s.CXPage -->
                        <div id="CXPage">

                            <ax:row>
                                <ax:col size="12" style="padding:20px;box-sizing:border-box;">
                                    <div class="ax-button-group">
                                        <div class="left">
                                            <h1>샘플페이지</h1>
                                        </div>
                                        <div class="right">

                                        </div>
                                        <div class="ax-clear"></div>
                                    </div>

                                    <p>
                                        샘플페이지를 만든다는 것은 어려운 일이기 때문에 잘 된다는 마음으로 최선을 다 하다 보면은 그런 마음으로 하다보면 안될 것이 없지 않기도 하기 때문에.
                                    </p>

                                    <div class="H10"></div>
                                    <div style="border-top:1px dashed #ccc;"></div>
                                    <div class="H20"></div>

                                    <div>
                                        <button class="AXButton Red W130" id="ax-form-btn-dll-download"
                                                onclick="location.href='/api/v1/libraryDevelop/download?type=dll';"><i
                                                class="axi axi-download2"></i>&nbsp;DLL 파일
                                        </button>
                                        &nbsp;&nbsp;
                                        <button class="AXButton Blue W130" id="ax-form-btn-dll-download"
                                                onclick="location.href='/api/v1/libraryDevelop/download?type=dllSample';">
                                            <i class="axi axi-file-code-o"></i>&nbsp;DLL 연동샘플
                                        </button>
                                        &nbsp;&nbsp;
                                        <button class="AXButton Blue W130" id="ax-form-btn-manual-download"
                                                onclick="location.href='/api/v1/libraryDevelop/download?type=dllDocument';">
                                            <i class="axi axi-file-powerpoint-o"></i>&nbsp;DLL 메뉴얼
                                        </button>
                                    </div>
                                    <div class="H10"></div>
                                    <div>
                                        <button class="AXButton Blue W130" id="ax-form-btn-manual-download"
                                                onclick="location.href='/api/v1/libraryDevelop/download?type=posManual';">
                                            <i class="axi axi-file-powerpoint-o"></i>&nbsp;공항포스 메뉴얼
                                        </button>
                                        &nbsp;&nbsp;
                                        <button class="AXButton Blue W130" id="ax-form-btn-manual-download"
                                                onclick="location.href='/api/v1/libraryDevelop/download?type=itemUploadManual';">
                                            <i class="axi axi-file-powerpoint-o"></i>&nbsp;품목등록 메뉴얼
                                        </button>
                                    </div>
                                </ax:col>
                            </ax:row>

                            <ax:row>
                                <ax:col size="12" style="padding:10px;box-sizing:border-box;">

                                    <div class="ax-button-group">
                                        <div class="left">
                                            <h2>제.개정 이력</h2>
                                        </div>
                                        <div class="right">

                                        </div>
                                        <div class="ax-clear"></div>
                                    </div>

                                    <table cellpadding="0" cellspacing="0" class="AXGridTable">
                                        <colgroup>
                                            <col width="60"/>
                                            <col/>
                                            <col width="110"/>
                                        </colgroup>
                                        <thead>
                                        <tr align="center">
                                            <td>
                                                <div class="tdRel">
                                                    개정번호
                                                </div>
                                            </td>
                                            <td>
                                                <div class="tdRel">
                                                    제.개정 페이지 및 내용
                                                </div>
                                            </td>
                                            <td>
                                                <div class="tdRel">
                                                    제.개정 일자
                                                </div>
                                            </td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td align="center">
                                                1.6
                                            </td>
                                            <td align="ㅣㄷㄹㅅ">
                                                PosGetSaleVW, <br/>
                                                PosGetSaleVWEx, <br/>
                                                PosGetOpenVW, <br/>
                                                PosGetOpenVWEx, <br/>
                                                PosGetItemVW, <br/>
                                                PosGetItemVWEx, <br/>
                                                PosGetExcVW, <br/>
                                                PosGetExcVWEx, <br/>
                                                PosGetEtcPayVW, <br/>
                                                PosGetEtcPayVWEx, <br/>
                                                PosGetItemSaleVW, <br/>
                                                PosGetItemSaleVWEx, <br/>
                                                PosSetPrtD, <br/>
                                                PosSetEtcPayD <br/>
                                                함수 추가
                                            </td>
                                            <td align="center">
                                                2015/05/25
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
                                                1.5
                                            </td>
                                            <td align="ㅣㄷㄹㅅ">
                                                PosGetLastErrorMsg 함수 추가
                                            </td>
                                            <td align="center">
                                                2015/05/15
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
                                                1.4
                                            </td>
                                            <td align="ㅣㄷㄹㅅ">
                                                Unmanaged vc 개발환경 추가
                                            </td>
                                            <td align="center">
                                                2015/05/14
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
                                                1.3
                                            </td>
                                            <td align="ㅣㄷㄹㅅ">
                                                PosGetSalesTrStatus 함수추가
                                            </td>
                                            <td align="center">
                                                2015/05/11
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
                                                1.2
                                            </td>
                                            <td align="ㅣㄷㄹㅅ">
                                                Mdac 관련
                                            </td>
                                            <td align="center">
                                                2015/05/08
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
                                                1.1
                                            </td>
                                            <td align="ㅣㄷㄹㅅ">
                                                개정
                                            </td>
                                            <td align="center">
                                                2015/05/06
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>

                                </ax:col>
                            </ax:row>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript">
            var fnObj = {
                pageStart: function () {
                    this.bindEvent();
                    //this.form.bind();
                },
                bindEvent: function () {

                }
            };
            $(document.body).ready(function () {
                fnObj.pageStart();
            });
        </script>
    </ax:div>
</ax:layout>