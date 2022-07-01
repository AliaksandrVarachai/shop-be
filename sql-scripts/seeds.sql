-- source: https://www.hobbylinc.com/plastic-model-airplanes-1:70-1:79-scale

insert into products (title, description, price)
values
    ('SR-71A Blackbird', 'This is a 1/72 SR-71A Blackbird Plastic Model Aircraft Kit. Skill Level 2 for ages 10 to Adult, Intermediate to Advanced Modelers.', 22),
    ('PBY-5A BLACK CAT USN', 'This is a plastic 1/72 Consolidated PBY-5A Catalina USN Patrol Airplane from Academy Plastics. It is for experienced modelers.', 29),
    ('F6F-3/5 USA HELLCAT', 'This is the Academy F6F-3/5 Hellcat 1/72 scale plastic model airplane kit.', 12),
    ('C-47 SKYTRAIN', 'This is the 1/72 Scale C-47 Skytrain Plastic Model Airplane Kit from Italeri. Suitable for Ages 14 & Up.', 25),
    ('B-58 HUSTLER', 'This is the 1/72 Scale B-58 Hustler Plastic Model Kit by Italeri. Suitable for Ages 14 & Up.', 35);


insert into stocks (product_id, count)
values
    ((select product_id from products where title='SR-71A Blackbird'), 2),
    ((select product_id from products where title='PBY-5A BLACK CAT USN'), 5),
    ((select product_id from products where title='F6F-3/5 USA HELLCAT'), 3),
    ((select product_id from products where title='C-47 SKYTRAIN'), 11),
    ((select product_id from products where title='B-58 HUSTLER'), 7),
    ((select product_id from products where title='SR-71A Blackbird'), 8),
    ((select product_id from products where title='PBY-5A BLACK CAT USN'), 4),
    ((select product_id from products where title='F6F-3/5 USA HELLCAT'), 15);
