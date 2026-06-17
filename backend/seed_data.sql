-- Auto-Ism seed data exported from SQLite

-- user (6 rows)
INSERT INTO "user" ("id", "email", "password", "firstname", "lastname", "dob", "sex", "is_admin", "created_at", "profile_image") VALUES (1, 'admin1', 'pbkdf2:sha256:1000000$KHl8UAG5Ic6wzXQd$d68184ffbfed78f3ed02e149813f59f228d2db6190e1f13fd58921618b1d1606', 'Owner', 'Dashboard', '', 'male', 1, '2026-03-16 22:09:57.336032', '/static/uploads/user_1_1781637544.jpeg');
INSERT INTO "user" ("id", "email", "password", "firstname", "lastname", "dob", "sex", "is_admin", "created_at", "profile_image") VALUES (2, 'abdohussin026@gmail.com', 'pbkdf2:sha256:1000000$MgWfGYpEVwkDHe7k$f63532b4ca26f40ca1f2ecb60a37ddbdc7054f166421851947a7d480a9527080', 'alHussain', 'abdo', '2003-07-07', 'male', 0, '2026-03-16 22:17:41.117200', NULL);
INSERT INTO "user" ("id", "email", "password", "firstname", "lastname", "dob", "sex", "is_admin", "created_at", "profile_image") VALUES (3, 'abdohussin028@gmail.com', 'pbkdf2:sha256:1000000$AygCS7oeTkG8PdPg$b049373adea42adfaf6075a31144fc7ad69f3685deffa8e03fd727d49891a755', 'Arwa', 'Abdo', '', '', 0, '2026-06-16 17:30:57.977339', NULL);
INSERT INTO "user" ("id", "email", "password", "firstname", "lastname", "dob", "sex", "is_admin", "created_at", "profile_image") VALUES (4, 'abdohussin025@gmail.com', 'pbkdf2:sha256:1000000$60BWhXdyWlqKfckx$98bcb195681ed0d463ac73f7980375487c642f9d1c1f32689618a67add2e775f', 'Abdo', 'Mohamed', '', '', 0, '2026-06-16 19:38:20.706554', '/static/uploads/user_4_1781638700.jpeg');
INSERT INTO "user" ("id", "email", "password", "firstname", "lastname", "dob", "sex", "is_admin", "created_at", "profile_image") VALUES (5, 'ghorobabuzaid909@gmail.com', 'pbkdf2:sha256:1000000$Dso4ugcOQrTyJD86$5e2592ee5668899b49d303aa543de093e739263db1d458ba11d2f0c08d8b0b04', 'Ghorob', 'Ab', '', 'male', 0, '2026-06-16 20:50:38.730405', '/static/uploads/user_5_1781643274.jpeg');
INSERT INTO "user" ("id", "email", "password", "firstname", "lastname", "dob", "sex", "is_admin", "created_at", "profile_image") VALUES (6, 'alhassanalhodaifi16@gmail.com', 'pbkdf2:sha256:1000000$xGqKoMP5U0K4OgL2$cdd50f881b23ff7e9d5fc2d8e125a5ec8486984148b3b07bf69a1f61b03faf82', 'alhassan', 'abdo', '', '', 0, '2026-06-16 22:20:09.394039', '/static/uploads/user_6_1781648409.jpeg');

-- case (15 rows)
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (1, 'Ahmed', '2026-03-03', 'He is a bad boy, but in another life maybe he is a good one.', '2026-03-17 02:25:55.938849', 'Final risk 36.7% | Q-CHAT 2/10', 2);
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (4, 'احمد محمد علي', '2026-06-01', 'هذا الطفل جيد جداً', '2026-06-16 17:18:16.803215', 'Final risk 99.5% | Q-CHAT 6/10', 1);
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (5, 'لءال', '2026-06-04', 'لبالبال', '2026-06-16 17:21:10.361273', NULL, 1);
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (6, 'nmbhbhjbj', '2020-06-23', 'b,hgujhjk', '2026-06-16 18:14:56.999166', 'Final risk 69.6% | Q-CHAT 4/10', 1);
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (7, 'hsfhf', '2026-06-17', 'shfghsfhsfh', '2026-06-16 18:29:00.924882', 'Final risk 94.2% | Q-CHAT 5/10', 3);
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (8, 'Sarah Mohamed', '2026-01-14', 'she is good very nice', '2026-06-16 19:41:41.487545', 'Final risk 34.7% | Q-CHAT 1/10', 4);
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (9, 'غروب عبدالملك احمد ابوزيد', '2026-02-09', 'طفلة مشاغبة جداً , تتحدث بصعوبة و تشير دائماً الى الاعلى لا تتمكن من انشاء صداقات', '2026-06-16 19:44:02.317472', 'Final risk 21.3% | Q-CHAT 1/10', 4);
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (10, 'هدى محمد عبدالسلام', '2026-01-07', 'رائعة جداَ ومرحة', '2026-06-16 19:47:59.029919', 'Final risk 99.8% | Q-CHAT 9/10', 4);
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (12, 'ali naser', '2024-07-18', 'veeeeeeeeeeeeeeee', '2026-06-16 19:54:52.998690', 'Final risk 38.5% | Q-CHAT 1/10', 1);
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (13, 'amal fares', '2024-08-26', 'hoooooooooooooo', '2026-06-16 19:56:34.931204', 'Final risk 91.3% | Q-CHAT 9/10', 1);
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (14, 'felo rafek', '2023-12-13', 'gfgggggggggggg', '2026-06-16 20:00:09.036852', 'Final risk 40.4% | Q-CHAT 2/10', 1);
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (15, 's7s abdo', '2024-06-28', 'dsds', '2026-06-16 20:55:20.163798', 'Final risk 35.7% | Q-CHAT 0/10', 5);
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (16, 'الحسن عبده محمد', '2024-12-31', 'طفل جيد ورائع.', '2026-06-16 22:23:09.355102', 'Final risk 99.5% | Q-CHAT 8/10', 6);
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (17, 'bash mero', '2026-05-31', 'kjhdshghga', '2026-06-17 14:34:13.774745', 'Final risk 99.5% | Q-CHAT 9/10', 1);
INSERT INTO "case" ("id", "child_name", "child_dob", "brief", "created_at", "last_result_summary", "owner_id") VALUES (18, ',njkh', '2019-02-01', 'iuhhjkl;', '2026-06-17 15:38:42.868049', NULL, 1);

-- test_result (20 rows)
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (1, 1, '2026-03-17 02:27:04.068073', 2, 0.8760803937911987, 0.36739621763153274, 'Low autism likelihood', 'Q-CHAT risk: 2.8% | Facial risk: 87.6% | Final risk: 36.7%', '{"A1": "A", "A2": "A", "A3": "B", "A4": "B", "A5": "B", "A6": "B", "A7": "C", "A8": "B", "A9": "B", "A10": "B", "child_sex": "male", "child_ethnicity": "middle eastern", "jaundice": "no", "family_asd": "yes"}', 'Auto-Ism Final Report for Ahmed
Case ID: 1

Q-CHAT score: 2/10
Q-CHAT risk: 2.8%
Facial image risk: 87.6%
Final weighted risk: 36.7%
Final assessment: Low autism likelihood

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> A
2. How easy is it for you to get eye contact with your child? -> A
3. Does your child point to indicate that s/he wants something? -> B
4. Does your child point to share interest with you? -> B
5. Does your child pretend? -> B
6. Does your child follow where you’re looking? -> B
7. If someone is upset, does your child try to comfort them? -> C
8. Would you describe your child’s first words as: -> B
9. Does your child use simple gestures? -> B
10. Does your child stare at nothing with no apparent purpose? -> B

Child sex: male
Ethnicity: middle eastern
Jaundice history: no
Family ASD history: yes

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (6, 4, '2026-06-16 17:19:12.045191', 6, 0.9892455339431763, 0.9950799358488797, 'Autism likelihood detected', 'Q-CHAT risk: 99.9% | Facial risk: 98.9% | Final risk: 99.5%', '{"A1": "C", "A2": "E", "A3": "C", "A4": "A", "A5": "B", "A6": "C", "A7": "A", "A8": "E", "A9": "C", "A10": "D", "child_sex": "male", "child_ethnicity": "white-european", "jaundice": "no", "family_asd": "no"}', 'Auto-Ism Final Report for احمد محمد علي
Case ID: 4

Q-CHAT score: 6/10
Q-CHAT risk: 99.9%
Facial image risk: 98.9%
Final weighted risk: 99.5%
Final assessment: Autism likelihood detected

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> C
2. How easy is it for you to get eye contact with your child? -> E
3. Does your child point to indicate that s/he wants something? -> C
4. Does your child point to share interest with you? -> A
5. Does your child pretend? -> B
6. Does your child follow where you’re looking? -> C
7. If someone is upset, does your child try to comfort them? -> A
8. Would you describe your child’s first words as: -> E
9. Does your child use simple gestures? -> C
10. Does your child stare at nothing with no apparent purpose? -> D

Child sex: male
Ethnicity: white-european
Jaundice history: no
Family ASD history: no

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (7, 4, '2026-06-16 17:19:13.736707', 6, 0.9892455339431763, 0.9950799358488797, 'Autism likelihood detected', 'Q-CHAT risk: 99.9% | Facial risk: 98.9% | Final risk: 99.5%', '{"A1": "C", "A2": "E", "A3": "C", "A4": "A", "A5": "B", "A6": "C", "A7": "A", "A8": "E", "A9": "C", "A10": "D", "child_sex": "male", "child_ethnicity": "white-european", "jaundice": "no", "family_asd": "no"}', 'Auto-Ism Final Report for احمد محمد علي
Case ID: 4

Q-CHAT score: 6/10
Q-CHAT risk: 99.9%
Facial image risk: 98.9%
Final weighted risk: 99.5%
Final assessment: Autism likelihood detected

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> C
2. How easy is it for you to get eye contact with your child? -> E
3. Does your child point to indicate that s/he wants something? -> C
4. Does your child point to share interest with you? -> A
5. Does your child pretend? -> B
6. Does your child follow where you’re looking? -> C
7. If someone is upset, does your child try to comfort them? -> A
8. Would you describe your child’s first words as: -> E
9. Does your child use simple gestures? -> C
10. Does your child stare at nothing with no apparent purpose? -> D

Child sex: male
Ethnicity: white-european
Jaundice history: no
Family ASD history: no

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (8, 4, '2026-06-16 17:19:14.050539', 6, 0.9892455339431763, 0.9950799358488797, 'Autism likelihood detected', 'Q-CHAT risk: 99.9% | Facial risk: 98.9% | Final risk: 99.5%', '{"A1": "C", "A2": "E", "A3": "C", "A4": "A", "A5": "B", "A6": "C", "A7": "A", "A8": "E", "A9": "C", "A10": "D", "child_sex": "male", "child_ethnicity": "white-european", "jaundice": "no", "family_asd": "no"}', 'Auto-Ism Final Report for احمد محمد علي
Case ID: 4

Q-CHAT score: 6/10
Q-CHAT risk: 99.9%
Facial image risk: 98.9%
Final weighted risk: 99.5%
Final assessment: Autism likelihood detected

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> C
2. How easy is it for you to get eye contact with your child? -> E
3. Does your child point to indicate that s/he wants something? -> C
4. Does your child point to share interest with you? -> A
5. Does your child pretend? -> B
6. Does your child follow where you’re looking? -> C
7. If someone is upset, does your child try to comfort them? -> A
8. Would you describe your child’s first words as: -> E
9. Does your child use simple gestures? -> C
10. Does your child stare at nothing with no apparent purpose? -> D

Child sex: male
Ethnicity: white-european
Jaundice history: no
Family ASD history: no

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (9, 6, '2026-06-16 18:19:19.829128', 4, 0.4080715477466583, 0.6955520018389564, 'Autism likelihood detected', 'Q-CHAT risk: 88.7% | Facial risk: 40.8% | Final risk: 69.6%', '{"A1": "C", "A2": "C", "A3": "B", "A4": "E", "A5": "E", "A6": "A", "A7": "A", "A8": "A", "A9": "A", "A10": "D", "child_sex": "female", "child_ethnicity": "asian", "jaundice": "yes", "family_asd": "no"}', 'Auto-Ism Final Report for nmbhbhjbj
Case ID: 6

Q-CHAT score: 4/10
Q-CHAT risk: 88.7%
Facial image risk: 40.8%
Final weighted risk: 69.6%
Final assessment: Autism likelihood detected

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> C
2. How easy is it for you to get eye contact with your child? -> C
3. Does your child point to indicate that s/he wants something? -> B
4. Does your child point to share interest with you? -> E
5. Does your child pretend? -> E
6. Does your child follow where you’re looking? -> A
7. If someone is upset, does your child try to comfort them? -> A
8. Would you describe your child’s first words as: -> A
9. Does your child use simple gestures? -> A
10. Does your child stare at nothing with no apparent purpose? -> D

Child sex: female
Ethnicity: asian
Jaundice history: yes
Family ASD history: no

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (10, 6, '2026-06-16 18:19:20.269078', 4, 0.4080715477466583, 0.6955520018389564, 'Autism likelihood detected', 'Q-CHAT risk: 88.7% | Facial risk: 40.8% | Final risk: 69.6%', '{"A1": "C", "A2": "C", "A3": "B", "A4": "E", "A5": "E", "A6": "A", "A7": "A", "A8": "A", "A9": "A", "A10": "D", "child_sex": "female", "child_ethnicity": "asian", "jaundice": "yes", "family_asd": "no"}', 'Auto-Ism Final Report for nmbhbhjbj
Case ID: 6

Q-CHAT score: 4/10
Q-CHAT risk: 88.7%
Facial image risk: 40.8%
Final weighted risk: 69.6%
Final assessment: Autism likelihood detected

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> C
2. How easy is it for you to get eye contact with your child? -> C
3. Does your child point to indicate that s/he wants something? -> B
4. Does your child point to share interest with you? -> E
5. Does your child pretend? -> E
6. Does your child follow where you’re looking? -> A
7. If someone is upset, does your child try to comfort them? -> A
8. Would you describe your child’s first words as: -> A
9. Does your child use simple gestures? -> A
10. Does your child stare at nothing with no apparent purpose? -> D

Child sex: female
Ethnicity: asian
Jaundice history: yes
Family ASD history: no

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (11, 7, '2026-06-16 18:29:44.483221', 1, 0.9762634038925171, 0.3921710670820937, 'Low autism likelihood', 'Q-CHAT risk: 0.3% | Facial risk: 97.6% | Final risk: 39.2%', '{"A1": "A", "A2": "B", "A3": "B", "A4": "B", "A5": "B", "A6": "A", "A7": "B", "A8": "A", "A9": "A", "A10": "A", "child_sex": "male", "child_ethnicity": "middle eastern", "jaundice": "no", "family_asd": "no"}', 'Auto-Ism Final Report for hsfhf
Case ID: 7

Q-CHAT score: 1/10
Q-CHAT risk: 0.3%
Facial image risk: 97.6%
Final weighted risk: 39.2%
Final assessment: Low autism likelihood

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> A
2. How easy is it for you to get eye contact with your child? -> B
3. Does your child point to indicate that s/he wants something? -> B
4. Does your child point to share interest with you? -> B
5. Does your child pretend? -> B
6. Does your child follow where you’re looking? -> A
7. If someone is upset, does your child try to comfort them? -> B
8. Would you describe your child’s first words as: -> A
9. Does your child use simple gestures? -> A
10. Does your child stare at nothing with no apparent purpose? -> A

Child sex: male
Ethnicity: middle eastern
Jaundice history: no
Family ASD history: no

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (12, 7, '2026-06-16 19:21:47.753352', 5, 0.8738266229629517, 0.9415695960309811, 'Autism likelihood detected', 'Q-CHAT risk: 98.7% | Facial risk: 87.4% | Final risk: 94.2%', '{"A1": "E", "A2": "D", "A3": "A", "A4": "B", "A5": "C", "A6": "A", "A7": "C", "A8": "A", "A9": "A", "A10": "B", "child_sex": "male", "child_ethnicity": "asian", "jaundice": "yes", "family_asd": "yes"}', 'Auto-Ism Final Report for hsfhf
Case ID: 7

Q-CHAT score: 5/10
Q-CHAT risk: 98.7%
Facial image risk: 87.4%
Final weighted risk: 94.2%
Final assessment: Autism likelihood detected

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> E
2. How easy is it for you to get eye contact with your child? -> D
3. Does your child point to indicate that s/he wants something? -> A
4. Does your child point to share interest with you? -> B
5. Does your child pretend? -> C
6. Does your child follow where you’re looking? -> A
7. If someone is upset, does your child try to comfort them? -> C
8. Would you describe your child’s first words as: -> A
9. Does your child use simple gestures? -> A
10. Does your child stare at nothing with no apparent purpose? -> B

Child sex: male
Ethnicity: asian
Jaundice history: yes
Family ASD history: yes

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (13, 7, '2026-06-16 19:21:47.761731', 5, 0.8738266229629517, 0.9415695960309811, 'Autism likelihood detected', 'Q-CHAT risk: 98.7% | Facial risk: 87.4% | Final risk: 94.2%', '{"A1": "E", "A2": "D", "A3": "A", "A4": "B", "A5": "C", "A6": "A", "A7": "C", "A8": "A", "A9": "A", "A10": "B", "child_sex": "male", "child_ethnicity": "asian", "jaundice": "yes", "family_asd": "yes"}', 'Auto-Ism Final Report for hsfhf
Case ID: 7

Q-CHAT score: 5/10
Q-CHAT risk: 98.7%
Facial image risk: 87.4%
Final weighted risk: 94.2%
Final assessment: Autism likelihood detected

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> E
2. How easy is it for you to get eye contact with your child? -> D
3. Does your child point to indicate that s/he wants something? -> A
4. Does your child point to share interest with you? -> B
5. Does your child pretend? -> C
6. Does your child follow where you’re looking? -> A
7. If someone is upset, does your child try to comfort them? -> C
8. Would you describe your child’s first words as: -> A
9. Does your child use simple gestures? -> A
10. Does your child stare at nothing with no apparent purpose? -> B

Child sex: male
Ethnicity: asian
Jaundice history: yes
Family ASD history: yes

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (14, 7, '2026-06-16 19:21:49.111636', 5, 0.8738266229629517, 0.9415695960309811, 'Autism likelihood detected', 'Q-CHAT risk: 98.7% | Facial risk: 87.4% | Final risk: 94.2%', '{"A1": "E", "A2": "D", "A3": "A", "A4": "B", "A5": "C", "A6": "A", "A7": "C", "A8": "A", "A9": "A", "A10": "B", "child_sex": "male", "child_ethnicity": "asian", "jaundice": "yes", "family_asd": "yes"}', 'Auto-Ism Final Report for hsfhf
Case ID: 7

Q-CHAT score: 5/10
Q-CHAT risk: 98.7%
Facial image risk: 87.4%
Final weighted risk: 94.2%
Final assessment: Autism likelihood detected

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> E
2. How easy is it for you to get eye contact with your child? -> D
3. Does your child point to indicate that s/he wants something? -> A
4. Does your child point to share interest with you? -> B
5. Does your child pretend? -> C
6. Does your child follow where you’re looking? -> A
7. If someone is upset, does your child try to comfort them? -> C
8. Would you describe your child’s first words as: -> A
9. Does your child use simple gestures? -> A
10. Does your child stare at nothing with no apparent purpose? -> B

Child sex: male
Ethnicity: asian
Jaundice history: yes
Family ASD history: yes

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (15, 8, '2026-06-16 19:42:26.758391', 1, 0.8643602132797241, 0.3474412784030654, 'Low autism likelihood', 'Q-CHAT risk: 0.3% | Facial risk: 86.4% | Final risk: 34.7%', '{"A1": "A", "A2": "A", "A3": "A", "A4": "A", "A5": "A", "A6": "A", "A7": "A", "A8": "A", "A9": "A", "A10": "A", "child_sex": "male", "child_ethnicity": "latino", "jaundice": "yes", "family_asd": "no"}', 'Auto-Ism Final Report for Sarah Mohamed
Case ID: 8

Q-CHAT score: 1/10
Q-CHAT risk: 0.3%
Facial image risk: 86.4%
Final weighted risk: 34.7%
Final assessment: Low autism likelihood

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> A
2. How easy is it for you to get eye contact with your child? -> A
3. Does your child point to indicate that s/he wants something? -> A
4. Does your child point to share interest with you? -> A
5. Does your child pretend? -> A
6. Does your child follow where you’re looking? -> A
7. If someone is upset, does your child try to comfort them? -> A
8. Would you describe your child’s first words as: -> A
9. Does your child use simple gestures? -> A
10. Does your child stare at nothing with no apparent purpose? -> A

Child sex: male
Ethnicity: latino
Jaundice history: yes
Family ASD history: no

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (16, 9, '2026-06-16 19:46:36.961802', 1, 0.5307725667953491, 0.21308211914220293, 'Low autism likelihood', 'Q-CHAT risk: 0.1% | Facial risk: 53.1% | Final risk: 21.3%', '{"A1": "A", "A2": "A", "A3": "A", "A4": "A", "A5": "A", "A6": "A", "A7": "A", "A8": "A", "A9": "B", "A10": "C", "child_sex": "female", "child_ethnicity": "pacifica", "jaundice": "no", "family_asd": "yes"}', 'Auto-Ism Final Report for غروب عبدالملك احمد ابوزيد
Case ID: 9

Q-CHAT score: 1/10
Q-CHAT risk: 0.1%
Facial image risk: 53.1%
Final weighted risk: 21.3%
Final assessment: Low autism likelihood

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> A
2. How easy is it for you to get eye contact with your child? -> A
3. Does your child point to indicate that s/he wants something? -> A
4. Does your child point to share interest with you? -> A
5. Does your child pretend? -> A
6. Does your child follow where you’re looking? -> A
7. If someone is upset, does your child try to comfort them? -> A
8. Would you describe your child’s first words as: -> A
9. Does your child use simple gestures? -> B
10. Does your child stare at nothing with no apparent purpose? -> C

Child sex: female
Ethnicity: pacifica
Jaundice history: no
Family ASD history: yes

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (17, 10, '2026-06-16 19:48:55.920500', 9, 0.9961576461791992, 0.9984618708176297, 'Autism likelihood detected', 'Q-CHAT risk: 100.0% | Facial risk: 99.6% | Final risk: 99.8%', '{"A1": "E", "A2": "E", "A3": "E", "A4": "E", "A5": "E", "A6": "E", "A7": "E", "A8": "E", "A9": "E", "A10": "E", "child_sex": "female", "child_ethnicity": "native indian", "jaundice": "no", "family_asd": "no"}', 'Auto-Ism Final Report for هدى محمد عبدالسلام
Case ID: 10

Q-CHAT score: 9/10
Q-CHAT risk: 100.0%
Facial image risk: 99.6%
Final weighted risk: 99.8%
Final assessment: Autism likelihood detected

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> E
2. How easy is it for you to get eye contact with your child? -> E
3. Does your child point to indicate that s/he wants something? -> E
4. Does your child point to share interest with you? -> E
5. Does your child pretend? -> E
6. Does your child follow where you’re looking? -> E
7. If someone is upset, does your child try to comfort them? -> E
8. Would you describe your child’s first words as: -> E
9. Does your child use simple gestures? -> E
10. Does your child stare at nothing with no apparent purpose? -> E

Child sex: female
Ethnicity: native indian
Jaundice history: no
Family ASD history: no

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (19, 12, '2026-06-16 19:55:41.881770', 1, 0.9577033519744873, 0.3846276032019823, 'Low autism likelihood', 'Q-CHAT risk: 0.3% | Facial risk: 95.8% | Final risk: 38.5%', '{"A1": "A", "A2": "A", "A3": "A", "A4": "A", "A5": "A", "A6": "A", "A7": "A", "A8": "A", "A9": "A", "A10": "A", "child_sex": "male", "child_ethnicity": "black", "jaundice": "no", "family_asd": "no"}', 'Auto-Ism Final Report for ali naser
Case ID: 12

Q-CHAT score: 1/10
Q-CHAT risk: 0.3%
Facial image risk: 95.8%
Final weighted risk: 38.5%
Final assessment: Low autism likelihood

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> A
2. How easy is it for you to get eye contact with your child? -> A
3. Does your child point to indicate that s/he wants something? -> A
4. Does your child point to share interest with you? -> A
5. Does your child pretend? -> A
6. Does your child follow where you’re looking? -> A
7. If someone is upset, does your child try to comfort them? -> A
8. Would you describe your child’s first words as: -> A
9. Does your child use simple gestures? -> A
10. Does your child stare at nothing with no apparent purpose? -> A

Child sex: male
Ethnicity: black
Jaundice history: no
Family ASD history: no

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (20, 13, '2026-06-16 19:57:27.903241', 9, 0.7823034524917603, 0.9129206431507813, 'Autism likelihood detected', 'Q-CHAT risk: 100.0% | Facial risk: 78.2% | Final risk: 91.3%', '{"A1": "D", "A2": "D", "A3": "D", "A4": "D", "A5": "D", "A6": "D", "A7": "D", "A8": "D", "A9": "D", "A10": "D", "child_sex": "male", "child_ethnicity": "native indian", "jaundice": "yes", "family_asd": "no"}', 'Auto-Ism Final Report for amal fares
Case ID: 13

Q-CHAT score: 9/10
Q-CHAT risk: 100.0%
Facial image risk: 78.2%
Final weighted risk: 91.3%
Final assessment: Autism likelihood detected

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> D
2. How easy is it for you to get eye contact with your child? -> D
3. Does your child point to indicate that s/he wants something? -> D
4. Does your child point to share interest with you? -> D
5. Does your child pretend? -> D
6. Does your child follow where you’re looking? -> D
7. If someone is upset, does your child try to comfort them? -> D
8. Would you describe your child’s first words as: -> D
9. Does your child use simple gestures? -> D
10. Does your child stare at nothing with no apparent purpose? -> D

Child sex: male
Ethnicity: native indian
Jaundice history: yes
Family ASD history: no

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (21, 14, '2026-06-16 20:00:56.208912', 10, 0.9871392846107483, 0.9948556417855217, 'Autism likelihood detected', 'Q-CHAT risk: 100.0% | Facial risk: 98.7% | Final risk: 99.5%', '{"A1": "E", "A2": "E", "A3": "E", "A4": "E", "A5": "E", "A6": "E", "A7": "E", "A8": "E", "A9": "E", "A10": "A", "child_sex": "male", "child_ethnicity": "others", "jaundice": "yes", "family_asd": "yes"}', 'Auto-Ism Final Report for felo rafek
Case ID: 14

Q-CHAT score: 10/10
Q-CHAT risk: 100.0%
Facial image risk: 98.7%
Final weighted risk: 99.5%
Final assessment: Autism likelihood detected

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> E
2. How easy is it for you to get eye contact with your child? -> E
3. Does your child point to indicate that s/he wants something? -> E
4. Does your child point to share interest with you? -> E
5. Does your child pretend? -> E
6. Does your child follow where you’re looking? -> E
7. If someone is upset, does your child try to comfort them? -> E
8. Would you describe your child’s first words as: -> E
9. Does your child use simple gestures? -> E
10. Does your child stare at nothing with no apparent purpose? -> A

Child sex: male
Ethnicity: others
Jaundice history: yes
Family ASD history: yes

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (22, 15, '2026-06-16 20:56:18.034265', 0, 0.8924019932746887, 0.3571475882762875, 'Low autism likelihood', 'Q-CHAT risk: 0.0% | Facial risk: 89.2% | Final risk: 35.7%', '{"A1": "A", "A2": "A", "A3": "A", "A4": "A", "A5": "A", "A6": "A", "A7": "A", "A8": "A", "A9": "A", "A10": "E", "child_sex": "male", "child_ethnicity": "middle eastern", "jaundice": "no", "family_asd": "no"}', 'Auto-Ism Final Report for s7s abdo
Case ID: 15

Q-CHAT score: 0/10
Q-CHAT risk: 0.0%
Facial image risk: 89.2%
Final weighted risk: 35.7%
Final assessment: Low autism likelihood

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> A
2. How easy is it for you to get eye contact with your child? -> A
3. Does your child point to indicate that s/he wants something? -> A
4. Does your child point to share interest with you? -> A
5. Does your child pretend? -> A
6. Does your child follow where you’re looking? -> A
7. If someone is upset, does your child try to comfort them? -> A
8. Would you describe your child’s first words as: -> A
9. Does your child use simple gestures? -> A
10. Does your child stare at nothing with no apparent purpose? -> E

Child sex: male
Ethnicity: middle eastern
Jaundice history: no
Family ASD history: no

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (23, 16, '2026-06-16 22:24:15.452189', 8, 0.9871392846107483, 0.9948430494391409, 'Autism likelihood detected', 'Q-CHAT risk: 100.0% | Facial risk: 98.7% | Final risk: 99.5%', '{"A1": "A", "A2": "C", "A3": "C", "A4": "D", "A5": "D", "A6": "C", "A7": "B", "A8": "D", "A9": "C", "A10": "C", "child_sex": "male", "child_ethnicity": "native indian", "jaundice": "no", "family_asd": "no"}', 'Auto-Ism Final Report for الحسن عبده محمد
Case ID: 16

Q-CHAT score: 8/10
Q-CHAT risk: 100.0%
Facial image risk: 98.7%
Final weighted risk: 99.5%
Final assessment: Autism likelihood detected

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> A
2. How easy is it for you to get eye contact with your child? -> C
3. Does your child point to indicate that s/he wants something? -> C
4. Does your child point to share interest with you? -> D
5. Does your child pretend? -> D
6. Does your child follow where you’re looking? -> C
7. If someone is upset, does your child try to comfort them? -> B
8. Would you describe your child’s first words as: -> D
9. Does your child use simple gestures? -> C
10. Does your child stare at nothing with no apparent purpose? -> C

Child sex: male
Ethnicity: native indian
Jaundice history: no
Family ASD history: no

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (24, 14, '2026-06-17 13:54:18.647291', 2, 0.9871392846107483, 0.40440097722720486, 'Low autism likelihood', 'Q-CHAT risk: 1.6% | Facial risk: 98.7% | Final risk: 40.4%', '{"A1": "C", "A2": "A", "A3": "B", "A4": "A", "A5": "A", "A6": "A", "A7": "A", "A8": "A", "A9": "B", "A10": "A", "child_sex": "male", "child_ethnicity": "pacifica", "jaundice": "no", "family_asd": "no"}', 'Auto-Ism Final Report for felo rafek
Case ID: 14

Q-CHAT score: 2/10
Q-CHAT risk: 1.6%
Facial image risk: 98.7%
Final weighted risk: 40.4%
Final assessment: Low autism likelihood

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> C
2. How easy is it for you to get eye contact with your child? -> A
3. Does your child point to indicate that s/he wants something? -> B
4. Does your child point to share interest with you? -> A
5. Does your child pretend? -> A
6. Does your child follow where you’re looking? -> A
7. If someone is upset, does your child try to comfort them? -> A
8. Would you describe your child’s first words as: -> A
9. Does your child use simple gestures? -> B
10. Does your child stare at nothing with no apparent purpose? -> A

Child sex: male
Ethnicity: pacifica
Jaundice history: no
Family ASD history: no

Note: This report is a screening aid and does not replace a clinical diagnosis.');
INSERT INTO "test_result" ("id", "case_id", "created_at", "spark_score", "image_score", "combined_risk", "prediction_label", "notes", "answers_json", "report_text") VALUES (25, 17, '2026-06-17 14:35:12.576568', 9, 0.9871392846107483, 0.994855049306957, 'Autism likelihood detected', 'Q-CHAT risk: 100.0% | Facial risk: 98.7% | Final risk: 99.5%', '{"A1": "A", "A2": "C", "A3": "E", "A4": "D", "A5": "E", "A6": "E", "A7": "E", "A8": "E", "A9": "D", "A10": "B", "child_sex": "female", "child_ethnicity": "asian", "jaundice": "no", "family_asd": "no"}', 'Auto-Ism Final Report for bash mero
Case ID: 17

Q-CHAT score: 9/10
Q-CHAT risk: 100.0%
Facial image risk: 98.7%
Final weighted risk: 99.5%
Final assessment: Autism likelihood detected

Weighting used:
Q-CHAT weight = 0.6
Facial image weight = 0.4

Question responses:
1. Does your child look at you when you call his/her name? -> A
2. How easy is it for you to get eye contact with your child? -> C
3. Does your child point to indicate that s/he wants something? -> E
4. Does your child point to share interest with you? -> D
5. Does your child pretend? -> E
6. Does your child follow where you’re looking? -> E
7. If someone is upset, does your child try to comfort them? -> E
8. Would you describe your child’s first words as: -> E
9. Does your child use simple gestures? -> D
10. Does your child stare at nothing with no apparent purpose? -> B

Child sex: female
Ethnicity: asian
Jaundice history: no
Family ASD history: no

Note: This report is a screening aid and does not replace a clinical diagnosis.');

-- game_score (10 rows)
INSERT INTO "game_score" ("id", "case_id", "game", "level", "score", "max_score", "updated_at") VALUES (1, 9, 'recognition', 'medium', 2, 20, '2026-06-16 20:39:51.333627');
INSERT INTO "game_score" ("id", "case_id", "game", "level", "score", "max_score", "updated_at") VALUES (2, 9, 'shapes', 'easy', 2, 8, '2026-06-16 20:40:00.310250');
INSERT INTO "game_score" ("id", "case_id", "game", "level", "score", "max_score", "updated_at") VALUES (3, 9, 'emotions', 'standard', 2, 8, '2026-06-16 20:40:12.031202');
INSERT INTO "game_score" ("id", "case_id", "game", "level", "score", "max_score", "updated_at") VALUES (4, 14, 'emotions', 'standard', 7, 8, '2026-06-16 20:42:25.519983');
INSERT INTO "game_score" ("id", "case_id", "game", "level", "score", "max_score", "updated_at") VALUES (5, 14, 'shapes', 'easy', 8, 8, '2026-06-16 20:42:46.105565');
INSERT INTO "game_score" ("id", "case_id", "game", "level", "score", "max_score", "updated_at") VALUES (6, 14, 'recognition', 'easy', 7, 10, '2026-06-16 20:43:06.097153');
INSERT INTO "game_score" ("id", "case_id", "game", "level", "score", "max_score", "updated_at") VALUES (7, 15, 'shapes', 'hard', 24, 24, '2026-06-16 20:57:43.512481');
INSERT INTO "game_score" ("id", "case_id", "game", "level", "score", "max_score", "updated_at") VALUES (8, 16, 'recognition', 'easy', 3, 10, '2026-06-17 13:53:05.694362');
INSERT INTO "game_score" ("id", "case_id", "game", "level", "score", "max_score", "updated_at") VALUES (9, 16, 'shapes', 'hard', 24, 24, '2026-06-16 22:25:54.085145');
INSERT INTO "game_score" ("id", "case_id", "game", "level", "score", "max_score", "updated_at") VALUES (10, 16, 'emotions', 'standard', 2, 8, '2026-06-17 14:32:35.889272');

