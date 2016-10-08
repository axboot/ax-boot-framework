## Phase & Authorize tag

- ```<h1>TEST</h1>``` 태그를 COMPANY_MANAGER를 포함해 상위 권한을 가진 사용자와, 로컬 개발환경에서만 보여주고 싶을 경우. 다음과 같이 custom tag 사용가능.

```xml
<ax:phase pahse="local">
    <ax:authorize role="COMPANY_MANAGER" type="gte">
        <h1>TEST</h1>
    </ax:custom>
</ax:phase>
```
---
> 사용자 권한 계층
- SYSTEM_MANAGER (시스템 관리자)
- ASP_MANAGER (ASP 관리자)
- COMPANY_MANAGER (업체 관리자)
- STORE_MANAGER (매장 관리자)
---
> 롤 비교 방식 (type)
- 해당 롤과 동일한지 비교 : eq
- 해당 롤보다 상위 권한 : gt
- 해당 롤을 포함해 상위 권한 : gte
- 해당 롤보다 하위 권한 : lt
- 해당 롤을 포함해 하위 권한 : lte
---
> Phase
- local : 로컬개발모드
- alpha : 알파
- beta : 베타
- production : 실 서비스

---

## 예제

- 알파에서 시스템 관리자 권한만 보이도록
```xml
<ax:phase pahse="alpha">
    <ax:authorize role="SYSTEM_MANAGER" type="eq">
        <h1>TEST</h1>
    </ax:custom>
</ax:phase>
```
혹은
```xml
<ax:phase pahse="alpha">
    <ax:authorize role="SYSTEM_MANAGER">
        <h1>TEST</h1>
    </ax:custom>
</ax:phase>
```
> eq는 생략가능

- 리얼에서 매장 관리자 권한 이상만 보이도록
```xml
<ax:phase pahse="production">
    <ax:authorize role="STORE_MANAGER" type="gte">
        <h1>TEST</h1>
    </ax:custom>
</ax:phase>
```

- 베타에서 업체관리자 미만 권한에서만 보이도록
```xml
<ax:phase pahse="beta">
    <ax:authorize role="COMPANY_MANAGER" type="lt">
        <h1>TEST</h1>
    </ax:custom>
</ax:phase>
```