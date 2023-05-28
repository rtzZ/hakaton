begin;
drop table if exists incident_sum;

create table incident_sum as
select
	unom,
	count(1) as cnt,
	cast(date_ext_created as date) as date_ext_created
from incident
group by unom, cast(date_ext_created as date);


drop table if exists incident_pivot;

create table incident_pivot as
select
	unom,
	cast(date_ext_created as date) as date_ext_created,
	sum(case when name = 'asupr' then 1 else 0 end) as asupr,
	sum(case when name = 'gormost' then 1 else 0 end) as gormost,
	sum(case when name = 'edc' then 1 else 0 end) as edc,
	sum(case when name = 'mgi' then 1 else 0 end) as mgi,
	sum(case when name = 'cafap' then 1 else 0 end) as cafap,
	sum(case when name = 'mos_gas' then 1 else 0 end) as mos_gas,
	sum(case when name = 'mvk' then 1 else 0 end) as mvk,
	sum(case when name = 'ng' then 1 else 0 end) as ng
from incident as i
join system as s on i.system_id = s.id
group by unom, cast(date_ext_created as date);


drop table if exists incident_pivot_sum;

create table incident_pivot_sum as
select
	i_p.unom,
	i_p.date_ext_created,
	i_s.cnt,
	i_p.asupr,
	i_p.gormost,
	i_p.edc,
	i_p.mgi,
	i_p.cafap,
	i_p.mos_gas,
	i_p.mvk,
	i_p.ng
from incident_pivot as i_p
join incident_sum as i_s on i_p.unom = i_s.unom and i_p.date_ext_created = i_s.date_ext_created ;


drop table if exists prep_work;

create table prep_work as
select
	id,
	period,
	work_type_id,
	num_entrance,
	elevatornumber,
	plan_date_start,
	plan_date_end,
	fact_date_start,
	fact_date_end,
	unom,
	case when lag(fact_date_end) over (partition by unom, work_type_id order by fact_date_start) is null
	then cast('1900-01-01 00:00:00' as timestamp)
	else lag(fact_date_end) over (partition by unom, work_type_id order by fact_date_start) + interval '1 day' end as prev_date_end
from public.work;

drop table if exists object_with_work;

create table object_with_work as
select
	distinct w.work_type_id,
	w.prev_date_end,
	w.fact_date_start,
	o.unom,
	o.col_754,
	o.col_755,
	o.col_756,
	o.col_757,
	o.col_758_id,
	o.col_759,
	o.col_760,
	o.col_761,
	o.col_762,
	o.col_763,
	o.col_764,
	o.col_765,
	o.col_766,
	o.col_767,
	o.col_769_id,
	o.col_770_id,
	o.col_771,
	o.col_772,
	o.col_775_id,
	o.col_781_id,
	o.col_2156_id,
	o.col_2463_id,
	o.col_3163_id,
	o.col_3243_id,
	o.col_3363,
	o.col_103506_id
from object as o
left join prep_work as w on o.unom = w.unom
where o.col_2463_id = 42875644 and o.col_3163_id = 58761330;


drop table if exists object_with_work_dates;

create table object_with_work_dates as
select
	work_type_id,
	prev_date_end,
	fact_date_start,
	unom
from object_with_work;

drop table if exists incident_pivot_sum_final;

create table incident_pivot_sum_final as
select
	distinct o_d.work_type_id,
	o_d.unom,
	o_d.fact_date_start,
	i_p.cnt,
	i_p.asupr,
	i_p.gormost,
	i_p.edc,
	i_p.mgi,
	i_p.cafap,
	i_p.mos_gas,
	i_p.mvk,
	i_p.ng
from incident_pivot_sum as i_p
join object_with_work_dates as o_d
    on i_p.unom = o_d.unom
           and i_p.date_ext_created between o_d.prev_date_end
           and o_d.fact_date_start;

drop table if exists incident_pivot_sum_final_gr_bydate;

create table incident_pivot_sum_final_gr_bydate as
select
	work_type_id,
	unom,
	fact_date_start,
	sum(cnt) as cnt,
	sum(asupr) as asupr,
	sum(gormost) as gormost,
	sum(edc) as edc,
	sum(mgi) as mgi,
	sum(cafap) as cafap,
	sum(mos_gas) as mos_gas,
	sum(mvk) as mvk,
	sum(ng) as ng
from public.incident_pivot_sum_final
group by
	work_type_id,
	unom,
	fact_date_start;


drop table if exists incident_pivot_sum_final_gr_byunom;

create table incident_pivot_sum_final_gr_byunom as
select
	unom,
	sum(cnt) as cnt,
	sum(asupr) as asupr,
	sum(gormost) as gormost,
	sum(edc) as edc,
	sum(mgi) as mgi,
	sum(cafap) as cafap,
	sum(mos_gas) as mos_gas,
	sum(mvk) as mvk,
	sum(ng) as ng
from
	public.incident_pivot_sum
group by
	unom;

create index unom_fact_date_start_incident_pivot_sum_final_gr_bydate on
incident_pivot_sum_final_gr_bydate (unom, work_type_id, fact_date_start);

create index unom_fact_date_start_incident_pivot_sum_final_gr_byunom on
incident_pivot_sum_final_gr_byunom (unom);

create index unom_fact_date_start_object_with_work on
object_with_work (unom, work_type_id, fact_date_start);

drop table if exists model_test_asv_prefinal;

create table model_test_asv_prefinal as
select
	distinct coalesce(o_w.work_type_id, -1) as work_type_id,
	o_w.unom,
	o_w.col_754,
	o_w.col_755,
	o_w.col_756,
	o_w.col_757,
	o_w.col_758_id,
	o_w.col_759,
	o_w.col_760,
	o_w.col_761,
	o_w.col_762,
	o_w.col_763,
	o_w.col_764,
	o_w.col_765,
	o_w.col_766,
	o_w.col_767,
	o_w.col_769_id,
	o_w.col_770_id,
	o_w.col_771,
	o_w.col_772,
	o_w.col_775_id,
	o_w.col_781_id,
	o_w.col_2156_id,
	o_w.col_2463_id,
	o_w.col_3163_id,
	o_w.col_3243_id,
	o_w.col_3363,
	o_w.col_103506_id,
	coalesce(i_p.cnt, i_p_wo.cnt) as cnt,
	coalesce(i_p.asupr, i_p_wo.asupr) as asupr,
	coalesce(i_p.gormost, i_p_wo.gormost) as gormost,
	coalesce(i_p.edc, i_p_wo.edc) as edc,
	coalesce(i_p.mgi, i_p_wo.mgi) as mgi,
	coalesce(i_p.cafap, i_p_wo.cafap) as cafap,
	coalesce(i_p.mos_gas, i_p_wo.mos_gas) as mos_gas,
	coalesce(i_p.mvk, i_p_wo.mvk) as mvk,
	coalesce(i_p.ng, i_p_wo.ng) as ng
from object_with_work as o_w
left join incident_pivot_sum_final_gr_bydate as i_p on
	o_w.unom = i_p.unom
	and i_p.fact_date_start = o_w.fact_date_start
	and i_p.work_type_id = o_w.work_type_id
left join incident_pivot_sum_final_gr_byunom as i_p_wo on
	o_w.unom = i_p_wo.unom
	and i_p.fact_date_start is null;

commit;