create table USER_INFO
(
	ID NUMBER(18) not null
		constraint USER_PK
			primary key,
	USER_NAME VARCHAR2(50) not null,
	NAME VARCHAR2(50),
	PASSWORD VARCHAR2(50) not null,
	SALT VARCHAR2(20) not null,
	ROLE VARCHAR2(50),
	CREATE_TIME DATE,
	IS_DEL NUMBER(1)
)
/

comment on table USER_INFO is '后台用户'
/

comment on column USER_INFO.ID is '主键'
/

comment on column USER_INFO.USER_NAME is '用户名'
/

comment on column USER_INFO.NAME is '姓名'
/

comment on column USER_INFO.PASSWORD is '密码'
/

comment on column USER_INFO.SALT is 'salt值'
/

comment on column USER_INFO.ROLE is '角色'
/

comment on column USER_INFO.CREATE_TIME is '创建时间'
/

comment on column USER_INFO.IS_DEL is '是否删除'
/

create unique index DATE_USER_NAME_UINDEX
	on USER_INFO (USER_NAME)
/

create table MEMBER
(
	ID NUMBER(18) not null
		constraint MEMBER_PK
			primary key,
	USER_NAME VARCHAR2(50),
	NAME VARCHAR2(50),
	OPENID VARCHAR2(50),
	SEX NUMBER(1),
	HEAD_IMG VARCHAR2(50),
	CREATE_TIME DATE,
	PASSWORD VARCHAR2(50),
	SALT VARCHAR2(50),
	ERP_USER_ID NUMBER(18),
	TELEPHONE VARCHAR2(20)
)
/

comment on table MEMBER is '客户'
/

comment on column MEMBER.ID is '主键'
/

comment on column MEMBER.USER_NAME is '用户名'
/

comment on column MEMBER.NAME is '姓名'
/

comment on column MEMBER.OPENID is 'openid'
/

comment on column MEMBER.SEX is '性别'
/

comment on column MEMBER.HEAD_IMG is '头像'
/

comment on column MEMBER.CREATE_TIME is '创建时间'
/

comment on column MEMBER.PASSWORD is '密码'
/

comment on column MEMBER.SALT is 'salt'
/

comment on column MEMBER.ERP_USER_ID is 'erp用户id'
/

comment on column MEMBER.TELEPHONE is '手机号'
/

create table PUB_CUSTOMER
(
	CUSTOMID NUMBER not null
		primary key,
	CUSTOMNAME VARCHAR2(5) not null,
	CUSTOMPINYIN VARCHAR2(20) not null,
	CUSTOMNO VARCHAR2(5) not null,
	CUSTOMOPCODE VARCHAR2(5) not null,
	INPUTMANID NUMBER not null,
	MEMO VARCHAR2(50),
	REGISTADD VARCHAR2(20),
	USESTATUS NUMBER not null,
	GSPCATEGORYID NUMBER,
	MEDICODE VARCHAR2(20) not null,
	GSPFLAG NUMBER not null,
	TAXNUMBER VARCHAR2(10),
	ZONE VARCHAR2(10) not null,
	LEGALPERSON VARCHAR2(10) not null,
	INVTYPE NUMBER,
	INVDEMAND NUMBER,
	INVMETHOD NUMBER,
	INVMONTH NUMBER not null,
	INVDAY NUMBER not null,
	FMID NUMBER,
	INITFLAG NUMBER not null,
	CUSTOMERTYPE NUMBER not null,
	CREDATE DATE not null,
	COUNTRYID NUMBER,
	CORPCODE VARCHAR2(5),
	CITYID NUMBER not null,
	ADDRESS VARCHAR2(20) not null
)
/

comment on table PUB_CUSTOMER is '客户表'
/

comment on column PUB_CUSTOMER.CUSTOMID is '客户ID'
/

comment on column PUB_CUSTOMER.CUSTOMNAME is '客户名称'
/

comment on column PUB_CUSTOMER.CUSTOMPINYIN is '客户拼音'
/

comment on column PUB_CUSTOMER.CUSTOMNO is '客户分类编码'
/

comment on column PUB_CUSTOMER.CUSTOMOPCODE is '客户操作码'
/

comment on column PUB_CUSTOMER.INPUTMANID is '建立人ID'
/

comment on column PUB_CUSTOMER.MEMO is '备注'
/

comment on column PUB_CUSTOMER.REGISTADD is '注册地址'
/

comment on column PUB_CUSTOMER.USESTATUS is '使用状态'
/

comment on column PUB_CUSTOMER.GSPCATEGORYID is '客户质量类别'
/

comment on column PUB_CUSTOMER.MEDICODE is '药品监管码'
/

comment on column PUB_CUSTOMER.GSPFLAG is '医药行业标志'
/

comment on column PUB_CUSTOMER.TAXNUMBER is '税号'
/

comment on column PUB_CUSTOMER.ZONE is '地区'
/

comment on column PUB_CUSTOMER.LEGALPERSON is '法人代表'
/

comment on column PUB_CUSTOMER.INVTYPE is '缺省发票类型'
/

comment on column PUB_CUSTOMER.INVDEMAND is '发票要求'
/

comment on column PUB_CUSTOMER.INVMETHOD is '开票策略'
/

comment on column PUB_CUSTOMER.INVMONTH is '月'
/

comment on column PUB_CUSTOMER.INVDAY is '日'
/

comment on column PUB_CUSTOMER.FMID is '缺省外币ID'
/

comment on column PUB_CUSTOMER.INITFLAG is '期初数据标志'
/

comment on column PUB_CUSTOMER.CUSTOMERTYPE is '客户性质'
/

comment on column PUB_CUSTOMER.CREDATE is '建立日期'
/

comment on column PUB_CUSTOMER.COUNTRYID is '县ID'
/

comment on column PUB_CUSTOMER.CORPCODE is '组织代码'
/

comment on column PUB_CUSTOMER.CITYID is '市ID'
/

comment on column PUB_CUSTOMER.ADDRESS is '生产或仓库地址'
/

