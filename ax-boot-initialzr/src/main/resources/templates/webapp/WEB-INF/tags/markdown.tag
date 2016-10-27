<%@ tag import="org.apache.commons.io.IOUtils" %>
<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag import="org.commonmark.Extension" %>
<%@ tag import="org.commonmark.ext.autolink.AutolinkExtension" %>
<%@ tag import="org.commonmark.ext.gfm.strikethrough.StrikethroughExtension" %>
<%@ tag import="org.commonmark.ext.gfm.tables.TablesExtension" %>
<%@ tag import="org.commonmark.html.HtmlRenderer" %>
<%@ tag import="org.commonmark.node.Node" %>
<%@ tag import="org.commonmark.parser.Parser" %>
<%@ tag import="org.springframework.core.io.ClassPathResource" %>
<%@ tag import="java.util.Arrays" %>
<%@ tag import="java.util.List" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ attribute name="src" %>
<jsp:doBody var="body" scope="page"/>
<%
    String html = "";
    String md = "";

    if (StringUtils.isEmpty(src)) {
        int baseIndent = 0;
        md = (String) jspContext.getAttribute("body");

        String[] mdLines = md.split("\n");

        StringBuilder stringBuilder = new StringBuilder();

        for (int i = 0; i < mdLines.length; i++) {
            String line = mdLines[i];

            if (baseIndent == 0) {
                for (int k = 0; k < line.length(); k++) {
                    if (line.charAt(k) != ' ') {
                        baseIndent = k;
                        break;
                    }
                }
            }

            if (StringUtils.isNotEmpty(line)) {
                if (line.length() > baseIndent) {
                    stringBuilder.append(line.substring(baseIndent) + "\n");
                } else {
                    stringBuilder.append(line + "\n");
                }

            }
        }

        md = stringBuilder.toString();

    } else {
        md = IOUtils.toString(new ClassPathResource("/md/" + src).getInputStream(), "UTF-8");
    }

    List<Extension> extensions = Arrays.asList(TablesExtension.create(), StrikethroughExtension.create(), AutolinkExtension.create());
    Parser parser = Parser.builder().extensions(extensions).build();
    Node document = parser.parse(md);
    //HtmlRenderer renderer = HtmlRenderer.builder().build();
    HtmlRenderer renderer = HtmlRenderer.builder().extensions(extensions).build();
    html = renderer.render(document);
%>
<div class="ax-markdown">
<%=html%>
</div>