package com.vladislav.library.aspect;


import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class LoggingAspect {

    @Pointcut("within(com.vladislav.library.service..*)")
    public void serviceMethods() {}

    @Pointcut("within(com.vladislav.library.controller..*)")
    public void controllerMethods() {}

    @Before("serviceMethods()")
    public void logServiceEntry(JoinPoint joinPoint) {
        log.debug("Вход в метод: {}.{}() с аргументами: {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                joinPoint.getArgs());
    }

    @AfterReturning(pointcut = "serviceMethods()", returning = "result")
    public void logServiceExit(JoinPoint joinPoint, Object result) {
        log.debug("Выход из метода: {}.{}() результат: {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                result);
    }

    @AfterThrowing(pointcut = "serviceMethods()", throwing = "error")
    public void logServiceError(JoinPoint joinPoint, Throwable error) {
        log.error("Ошибка в методе: {}.{}() исключение: {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                error.getMessage(), error);
    }

    @Around("controllerMethods()")
    public Object logControllerExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - start;
            log.info("HTTP запрос: {}.{}() выполнен за {} мс",
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(),
                    duration);
            return result;
        } catch (Throwable e) {
            log.error("HTTP запрос failed: {}.{}() ошибка: {}",
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(),
                    e.getMessage());
            throw e;
        }
    }
}
