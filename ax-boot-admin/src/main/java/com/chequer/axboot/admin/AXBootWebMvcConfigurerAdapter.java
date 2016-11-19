package com.chequer.axboot.admin;

import com.chequer.axboot.core.filters.AXBootConfigFilter;
import com.chequer.axboot.core.filters.AXBootCorsFilter;
import com.chequer.axboot.core.filters.MultiReadableHttpServletRequestFilter;
import com.chequer.axboot.core.json.ContentTypeSwitchableMappingJackson2JsonView;
import com.chequer.axboot.core.message.AXBootReloadableResourceBundleMessageSource;
import com.chequer.axboot.core.parameter.RequestParamsArgumentResolver;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonEncoding;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.beans.BeansException;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.Ordered;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.accept.ContentNegotiationManager;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.view.ContentNegotiatingViewResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import java.nio.charset.Charset;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Configuration
public class AXBootWebMvcConfigurerAdapter extends WebMvcConfigurerAdapter implements ApplicationContextAware {
    private ApplicationContext applicationContext;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/assets/**").addResourceLocations("/assets/");
        registry.addResourceHandler("/axboot.config.js").addResourceLocations("/axboot.config.js");
        registry.addResourceHandler("/layout/**").addResourceLocations("/layout/");
        registry.addResourceHandler("/favicon.ico").addResourceLocations("/static/favicon.ico");
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        PageableHandlerMethodArgumentResolver pageableHandlerMethodArgumentResolver = new PageableHandlerMethodArgumentResolver();
        pageableHandlerMethodArgumentResolver.setPageParameterName("pageNumber");
        pageableHandlerMethodArgumentResolver.setSizeParameterName("pageSize");

        argumentResolvers.add(new RequestParamsArgumentResolver());
        argumentResolvers.add(pageableHandlerMethodArgumentResolver);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
    }

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(stringHttpMessageConverter());
        converters.add(mappingJackson2HttpMessageConverter());
    }

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        objectMapper.configure(MapperFeature.AUTO_DETECT_GETTERS, true);
        objectMapper.configure(MapperFeature.AUTO_DETECT_IS_GETTERS, true);
        objectMapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
        objectMapper.configure(MapperFeature.DEFAULT_VIEW_INCLUSION, false);
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

        JavaTimeModule javaTimeModule = new JavaTimeModule();

        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        javaTimeModule.addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ISO_LOCAL_DATE));
        javaTimeModule.addDeserializer(LocalDate.class, new LocalDateDeserializer(DateTimeFormatter.ISO_LOCAL_DATE));
        objectMapper.registerModule(javaTimeModule);
        return objectMapper;
    }

    @Bean
    public ContentNegotiatingViewResolver contentNegotiatingViewResolver() {
        ContentNegotiationManager contentNegotiationManager = new ContentNegotiationManager();

        ContentNegotiatingViewResolver contentNegotiatingViewResolver = new ContentNegotiatingViewResolver();
        contentNegotiatingViewResolver.setContentNegotiationManager(contentNegotiationManager);
        contentNegotiatingViewResolver.setOrder(Ordered.HIGHEST_PRECEDENCE);

        List<View> views = new ArrayList<>();
        ContentTypeSwitchableMappingJackson2JsonView contentTypeSwitchableMappingJackson2JsonView = new ContentTypeSwitchableMappingJackson2JsonView();
        contentTypeSwitchableMappingJackson2JsonView.setEncoding(JsonEncoding.UTF8);
        contentTypeSwitchableMappingJackson2JsonView.setExtractValueFromSingleKeyModel(true);
        contentTypeSwitchableMappingJackson2JsonView.setPrefixJson(false);
        contentTypeSwitchableMappingJackson2JsonView.setObjectMapper(objectMapper());

        views.add(contentTypeSwitchableMappingJackson2JsonView);

        contentNegotiatingViewResolver.setDefaultViews(views);

        List<ViewResolver> viewResolvers = new ArrayList<>();

        InternalResourceViewResolver internalResourceViewResolver = new InternalResourceViewResolver();
        internalResourceViewResolver.setPrefix("/jsp");
        internalResourceViewResolver.setSuffix(".jsp");

        viewResolvers.add(internalResourceViewResolver);

        contentNegotiatingViewResolver.setViewResolvers(viewResolvers);

        return contentNegotiatingViewResolver;
    }

    @Bean
    public FilterRegistrationBean multiReadableHttpServletRequestFilterRegistrationBean() {
        FilterRegistrationBean registrationBean = new FilterRegistrationBean();
        MultiReadableHttpServletRequestFilter multiReadableHttpServletRequestFilter = new MultiReadableHttpServletRequestFilter();
        registrationBean.setFilter(multiReadableHttpServletRequestFilter);
        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registrationBean;
    }

    @Bean
    public AXBootCorsFilter corsFilter() {
        return new AXBootCorsFilter();
    }

    @Bean
    public AXBootConfigFilter configFilter() {
        return new AXBootConfigFilter();
    }

    @Bean
    public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
        return new MappingJackson2HttpMessageConverter(objectMapper());
    }

    @Bean
    public StringHttpMessageConverter stringHttpMessageConverter() {
        return new StringHttpMessageConverter(Charset.forName("UTF-8"));
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
        localeChangeInterceptor.setParamName("language");
        return localeChangeInterceptor;
    }

    @Bean
    public MessageSource messageSource() {
        AXBootReloadableResourceBundleMessageSource axBootReloadableResourceBundleMessageSource = new AXBootReloadableResourceBundleMessageSource();
        axBootReloadableResourceBundleMessageSource.setBasename("classpath:messages/messages");
        axBootReloadableResourceBundleMessageSource.setDefaultEncoding("UTF-8");
        axBootReloadableResourceBundleMessageSource.setFallbackToSystemLocale(true);

        String[] activeProfiles = applicationContext.getEnvironment().getActiveProfiles();

        if ((activeProfiles != null && activeProfiles.length > 0 && activeProfiles[0].equals("local")) ||
                Boolean.parseBoolean(System.getProperty("axboot.profiles.development"))) {
            axBootReloadableResourceBundleMessageSource.setCacheSeconds(1);
        }

        return axBootReloadableResourceBundleMessageSource;
    }


    @Bean
    public LocaleResolver localeResolver() {
        CookieLocaleResolver cookieLocaleResolver = new CookieLocaleResolver();
        cookieLocaleResolver.setCookieName("language");
        cookieLocaleResolver.setCookiePath("/");
        cookieLocaleResolver.setDefaultLocale(new Locale("ko_KR"));
        return cookieLocaleResolver;
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}
