// Application-owned English keys; never send content to a translation service.
// Columns: English | Korean | Spanish | Portuguese | French | Arabic.
(()=>{
const rows=`
Admin Dashboard|관리자 대시보드|Panel de administración|Painel de administração|Tableau de bord administrateur|لوحة الإدارة
Admin Sign In|관리자 로그인|Acceso de administrador|Entrar como administrador|Connexion administrateur|تسجيل دخول الإدارة
Admin Users|관리자 계정|Administradores|Administradores|Administrateurs|المشرفون
Admin Audit Log|관리자 감사 로그|Registro de auditoría|Registo de auditoria|Journal d’audit|سجل التدقيق
Usage Analytics|사용 통계|Estadísticas de uso|Estatísticas de utilização|Statistiques d’utilisation|إحصاءات الاستخدام
Player Search|플레이어 검색|Búsqueda de jugadores|Pesquisa de jogadores|Recherche de joueurs|البحث عن اللاعبين
Transfer Manager|이전 관리|Gestión de transferencias|Gestão de transferências|Gestion des transferts|إدارة الانتقالات
Transfer Admin|이전 관리자|Administrador de transferencias|Administrador de transferências|Administration des transferts|إدارة الانتقالات
King's Buffs Admin|킹스 버프 관리|Administración de King's Buffs|Administração de King's Buffs|Administration des King's Buffs|إدارة تعزيزات الملك
King's Buff Bookings|킹스 버프 예약|Reservas de King's Buffs|Reservas de King's Buffs|Réservations de King's Buffs|حجوزات تعزيزات الملك
King's Buff registrations|킹스 버프 신청|Inscripciones de King's Buffs|Inscrições de King's Buffs|Inscriptions aux King's Buffs|تسجيلات تعزيزات الملك
← Admin Dashboard|← 관리자 대시보드|← Panel de administración|← Painel de administração|← Tableau de bord administrateur|← لوحة الإدارة
← 169 KS Tools|← 169 킹스샷 도구|← Herramientas KS 169|← Ferramentas KS 169|← Outils KS 169|← أدوات KS 169
Back to 169 KS Tools|169 킹스샷 도구로 돌아가기|Volver a Herramientas KS 169|Voltar às Ferramentas KS 169|Retour aux outils KS 169|العودة إلى أدوات KS 169
Continue to Admin|관리자로 이동|Ir a administración|Ir para administração|Accéder à l’administration|متابعة إلى الإدارة
Open admin area|관리자 영역 열기|Abrir administración|Abrir administração|Ouvrir l’administration|فتح منطقة الإدارة
Checking your session…|세션 확인 중…|Comprobando tu sesión…|A verificar a sessão…|Vérification de votre session…|جارٍ التحقق من جلستك…
Unable to check your session. Please try again.|세션을 확인할 수 없습니다. 다시 시도하세요.|No se pudo comprobar tu sesión. Inténtalo de nuevo.|Não foi possível verificar a sessão. Tente novamente.|Impossible de vérifier votre session. Réessayez.|تعذر التحقق من جلستك. حاول مجددًا.
Loading admin tools…|관리자 도구 불러오는 중…|Cargando herramientas de administración…|A carregar ferramentas de administração…|Chargement des outils d’administration…|جارٍ تحميل أدوات الإدارة…
Unable to load admin tools. Please try again.|관리자 도구를 불러올 수 없습니다. 다시 시도하세요.|No se pudieron cargar las herramientas. Inténtalo de nuevo.|Não foi possível carregar as ferramentas. Tente novamente.|Impossible de charger les outils. Réessayez.|تعذر تحميل أدوات الإدارة. حاول مجددًا.
Only tools assigned to your account are shown.|계정에 할당된 도구만 표시됩니다.|Solo se muestran las herramientas asignadas a tu cuenta.|Só são apresentadas as ferramentas atribuídas à sua conta.|Seuls les outils attribués à votre compte sont affichés.|تظهر فقط الأدوات المخصصة لحسابك.
No admin tools have been assigned to this account.|이 계정에 할당된 관리자 도구가 없습니다.|Esta cuenta no tiene herramientas asignadas.|Esta conta não tem ferramentas atribuídas.|Aucun outil d’administration n’est attribué à ce compte.|لم تُخصص أدوات إدارة لهذا الحساب.
Player ID or Email|플레이어 ID 또는 이메일|ID de jugador o correo|ID de jogador ou email|Identifiant joueur ou e-mail|معرّف اللاعب أو البريد الإلكتروني
Password|비밀번호|Contraseña|Palavra-passe|Mot de passe|كلمة المرور
Change Password|비밀번호 변경|Cambiar contraseña|Alterar palavra-passe|Changer le mot de passe|تغيير كلمة المرور
Choose Your Password|비밀번호 설정|Elige tu contraseña|Escolha a sua palavra-passe|Choisissez votre mot de passe|اختر كلمة مرورك
New Password|새 비밀번호|Nueva contraseña|Nova palavra-passe|Nouveau mot de passe|كلمة المرور الجديدة
Confirm Password|비밀번호 확인|Confirmar contraseña|Confirmar palavra-passe|Confirmer le mot de passe|تأكيد كلمة المرور
Update Password|비밀번호 업데이트|Actualizar contraseña|Atualizar palavra-passe|Mettre à jour le mot de passe|تحديث كلمة المرور
Updating Password…|비밀번호 변경 중…|Actualizando contraseña…|A atualizar a palavra-passe…|Mise à jour du mot de passe…|جارٍ تحديث كلمة المرور…
Updating your password securely…|비밀번호를 안전하게 변경하는 중…|Actualizando tu contraseña de forma segura…|A atualizar a palavra-passe com segurança…|Mise à jour sécurisée de votre mot de passe…|جارٍ تحديث كلمة مرورك بأمان…
Passwords do not match.|비밀번호가 일치하지 않습니다.|Las contraseñas no coinciden.|As palavras-passe não coincidem.|Les mots de passe ne correspondent pas.|كلمتا المرور غير متطابقتين.
Use at least 12 characters.|12자 이상 입력하세요.|Usa al menos 12 caracteres.|Use pelo menos 12 caracteres.|Utilisez au moins 12 caractères.|استخدم 12 حرفًا على الأقل.
Use at least 8 characters.|8자 이상 입력하세요.|Usa al menos 8 caracteres.|Use pelo menos 8 caracteres.|Utilisez au moins 8 caractères.|استخدم 8 أحرف على الأقل.
Invalid login or password.|로그인 정보 또는 비밀번호가 올바르지 않습니다.|Usuario o contraseña incorrectos.|Login ou palavra-passe inválidos.|Identifiant ou mot de passe incorrect.|بيانات الدخول أو كلمة المرور غير صحيحة.
Enter a valid Player ID or email address.|올바른 플레이어 ID 또는 이메일을 입력하세요.|Introduce un ID de jugador o correo válido.|Introduza um ID de jogador ou email válido.|Saisissez un identifiant joueur ou une adresse e-mail valide.|أدخل معرّف لاعب أو بريدًا إلكترونيًا صالحًا.
Your password is private to you. Use at least 12 characters.|비밀번호는 본인만 알아야 합니다. 12자 이상 사용하세요.|Tu contraseña es privada. Usa al menos 12 caracteres.|A sua palavra-passe é privada. Use pelo menos 12 caracteres.|Votre mot de passe est privé. Utilisez au moins 12 caractères.|كلمة مرورك خاصة بك. استخدم 12 حرفًا على الأقل.
Your temporary password must be changed before you can use the admin tools.|관리자 도구를 사용하기 전에 임시 비밀번호를 변경해야 합니다.|Debes cambiar la contraseña temporal antes de usar las herramientas.|Tem de alterar a palavra-passe temporária antes de usar as ferramentas.|Vous devez changer votre mot de passe temporaire avant d’utiliser les outils.|يجب تغيير كلمة المرور المؤقتة قبل استخدام أدوات الإدارة.
Loading…|불러오는 중…|Cargando…|A carregar…|Chargement…|جارٍ التحميل…
Saving…|저장 중…|Guardando…|A guardar…|Enregistrement…|جارٍ الحفظ…
Submitting…|제출 중…|Enviando…|A enviar…|Envoi…|جارٍ الإرسال…
Deleting…|삭제 중…|Eliminando…|A eliminar…|Suppression…|جارٍ الحذف…
Searching…|검색 중…|Buscando…|A pesquisar…|Recherche…|جارٍ البحث…
Checking…|확인 중…|Comprobando…|A verificar…|Vérification…|جارٍ التحقق…
Finding…|찾는 중…|Buscando…|A procurar…|Recherche…|جارٍ البحث…
Verifying…|인증 중…|Verificando…|A verificar…|Vérification…|جارٍ التحقق…
Find Player|플레이어 찾기|Buscar jugador|Procurar jogador|Trouver un joueur|البحث عن لاعب
Search Player|플레이어 검색|Buscar jugador|Pesquisar jogador|Rechercher un joueur|البحث عن لاعب
Search Kingshot Player|킹스샷 플레이어 검색|Buscar jugador de Kingshot|Pesquisar jogador de Kingshot|Rechercher un joueur Kingshot|البحث عن لاعب كينغشوت
Verify Player|플레이어 인증|Verificar jugador|Verificar jogador|Vérifier le joueur|التحقق من اللاعب
Different Player|다른 플레이어|Otro jugador|Outro jogador|Autre joueur|لاعب آخر
Player|플레이어|Jugador|Jogador|Joueur|اللاعب
Alliance|연맹|Alianza|Aliança|Alliance|التحالف
Kingshot Player ID|킹스샷 플레이어 ID|ID de jugador de Kingshot|ID de jogador de Kingshot|Identifiant joueur Kingshot|معرّف لاعب كينغشوت
State 169 Player ID|169 왕국 플레이어 ID|ID de jugador del Estado 169|ID de jogador do Estado 169|Identifiant joueur de l’État 169|معرّف لاعب الولاية 169
Enter your Kingshot Player ID|킹스샷 플레이어 ID 입력|Introduce tu ID de jugador de Kingshot|Introduza o seu ID de jogador de Kingshot|Saisissez votre identifiant joueur Kingshot|أدخل معرّف لاعب كينغشوت
Enter a valid numeric Player ID.|올바른 숫자 플레이어 ID를 입력하세요.|Introduce un ID de jugador numérico válido.|Introduza um ID de jogador numérico válido.|Saisissez un identifiant joueur numérique valide.|أدخل معرّف لاعب رقميًا صالحًا.
Enter a valid Kingshot Player ID.|올바른 킹스샷 플레이어 ID를 입력하세요.|Introduce un ID válido de Kingshot.|Introduza um ID válido de Kingshot.|Saisissez un identifiant Kingshot valide.|أدخل معرّف كينغشوت صالحًا.
Player loaded.|플레이어를 불러왔습니다.|Jugador cargado.|Jogador carregado.|Joueur chargé.|تم تحميل اللاعب.
Player profile picture|플레이어 프로필 사진|Foto del jugador|Foto do jogador|Photo du joueur|صورة اللاعب
Power|전투력|Poder|Poder|Puissance|القوة
Power / TC|전투력 / TC|Poder / TC|Poder / TC|Puissance / TC|القوة / TC
State / Alliance|왕국 / 연맹|Estado / Alianza|Estado / Aliança|État / Alliance|الولاية / التحالف
Coordinates|좌표|Coordenadas|Coordenadas|Coordonnées|الإحداثيات
Town Center|도시 센터|Centro urbano|Centro urbano|Centre-ville|مركز المدينة
Kills|처치 수|Bajas|Abates|Éliminations|القتلى
Online|접속 중|En línea|Online|En ligne|متصل
Last Active|최근 활동|Última actividad|Última atividade|Dernière activité|آخر نشاط
Office|직책|Cargo|Cargo|Fonction|المنصب
Governor Gear|영주 장비|Equipo del gobernador|Equipamento do governador|Équipement du gouverneur|معدات الحاكم
Heroes & Hero Gear|영웅 및 영웅 장비|Héroes y equipo|Heróis e equipamento|Héros et équipement|الأبطال ومعدات الأبطال
Power Breakdown|전투력 상세|Desglose de poder|Detalhes de poder|Détail de la puissance|تفاصيل القوة
Kingdom Rankings|왕국 순위|Clasificaciones del reino|Classificações do reino|Classements du royaume|تصنيفات المملكة
No data|데이터 없음|Sin datos|Sem dados|Aucune donnée|لا توجد بيانات
Hidden|비공개|Oculto|Oculto|Masqué|مخفي
Quality|품질|Calidad|Qualidade|Qualité|الجودة
Stars|별|Estrellas|Estrelas|Étoiles|النجوم
Tier|등급|Nivel|Nível|Palier|المستوى
Enhancement level|강화 레벨|Nivel de mejora|Nível de melhoria|Niveau d’amélioration|مستوى التحسين
Refine level|정련 레벨|Nivel de refinamiento|Nível de refinamento|Niveau de raffinement|مستوى الصقل
Strength|전력|Fuerza|Força|Force|القوة
Kingdom Strength|왕국 전력|Fuerza del reino|Força do reino|Force du royaume|قوة المملكة
Activity & Growth|활동 및 성장|Actividad y crecimiento|Atividade e crescimento|Activité et croissance|النشاط والنمو
Comparing…|비교 중…|Comparando…|A comparar…|Comparaison…|جارٍ المقارنة…
Loading kingdom statistics…|왕국 통계 불러오는 중…|Cargando estadísticas del reino…|A carregar estatísticas do reino…|Chargement des statistiques du royaume…|جارٍ تحميل إحصاءات المملكة…
Enter a valid opponent kingdom other than 169.|169 외의 올바른 상대 왕국을 입력하세요.|Introduce un reino válido distinto de 169.|Introduza um reino válido diferente de 169.|Saisissez un royaume valide autre que 169.|أدخل مملكة منافسة صالحة غير 169.
1. Find your Kingshot profile|1. 킹스샷 프로필 찾기|1. Busca tu perfil de Kingshot|1. Encontre o seu perfil de Kingshot|1. Trouvez votre profil Kingshot|1. ابحث عن ملفك في كينغشوت
2. Transfer details|2. 이전 정보|2. Datos de transferencia|2. Dados de transferência|2. Détails du transfert|2. تفاصيل الانتقال
Continue Application|신청 계속|Continuar solicitud|Continuar candidatura|Continuer la demande|متابعة الطلب
Submit Application|신청서 제출|Enviar solicitud|Enviar candidatura|Envoyer la demande|إرسال الطلب
Application received|신청 접수 완료|Solicitud recibida|Candidatura recebida|Demande reçue|تم استلام الطلب
Transfer Passes|이전 패스|Pases de transferencia|Passes de transferência|Pass de transfert|تذاكر الانتقال
Transfer passes|이전 패스|Pases de transferencia|Passes de transferência|Pass de transfert|تذاكر الانتقال
How many do you currently have?|현재 몇 개 보유하고 있나요?|¿Cuántos tienes actualmente?|Quantos tem atualmente?|Combien en avez-vous actuellement ?|كم تملك حاليًا؟
Preferred 169 Alliance|선호하는 169 연맹|Alianza preferida en 169|Aliança preferida em 169|Alliance souhaitée en 169|التحالف المفضل في 169
Preferred alliance|선호 연맹|Alianza preferida|Aliança preferida|Alliance souhaitée|التحالف المفضل
No preference|선호 없음|Sin preferencia|Sem preferência|Sans préférence|لا تفضيل
Other / discuss with leadership|기타 / 지도부와 상의|Otra / consultar con líderes|Outra / falar com a liderança|Autre / discuter avec les dirigeants|أخرى / مناقشة القيادة
Optional|선택 사항|Opcional|Opcional|Facultatif|اختياري
Referrer / Friends|추천인 / 친구|Referente / Amigos|Referência / Amigos|Parrain / Amis|المُحيل / الأصدقاء
Referred by / Friends in 169|추천인 / 169의 친구|Referente / Amigos en 169|Referência / Amigos em 169|Parrain / Amis en 169|المُحيل / الأصدقاء في 169
Why would you like to transfer to State 169?|169 왕국으로 이전하려는 이유는 무엇인가요?|¿Por qué quieres transferirte al Estado 169?|Porque quer transferir-se para o Estado 169?|Pourquoi souhaitez-vous rejoindre l’État 169 ?|لماذا ترغب في الانتقال إلى الولاية 169؟
Anything else we should know?|추가로 알려주실 내용이 있나요?|¿Algo más que debamos saber?|Mais alguma informação?|Autre chose à nous signaler ?|هل هناك شيء آخر ينبغي أن نعرفه؟
Reason|이유|Motivo|Motivo|Motif|السبب
Notes|메모|Notas|Notas|Notes|ملاحظات
Reference:|접수 번호:|Referencia:|Referência:|Référence :|المرجع:
Status|상태|Estado|Estado|Statut|الحالة
Status updated.|상태가 업데이트되었습니다.|Estado actualizado.|Estado atualizado.|Statut mis à jour.|تم تحديث الحالة.
All statuses|모든 상태|Todos los estados|Todos os estados|Tous les statuts|جميع الحالات
All|전체|Todos|Todos|Tous|الكل
Submitted|제출됨|Enviada|Enviada|Soumis|مُرسل
Reviewing|검토 중|En revisión|Em análise|En cours d’examen|قيد المراجعة
Approved|승인됨|Aprobada|Aprovada|Approuvé|مقبول
Waitlisted|대기 명단|En espera|Em espera|En liste d’attente|قائمة الانتظار
Declined|거절됨|Rechazada|Recusada|Refusé|مرفوض
Requested|신청됨|Solicitada|Solicitada|Demandé|مطلوب
Scheduled|일정 배정됨|Programada|Agendada|Planifié|مجدول
Booked|예약됨|Reservada|Reservada|Réservé|محجوز
Completed|완료됨|Completada|Concluída|Terminé|مكتمل
Cancelled|취소됨|Cancelada|Cancelada|Annulé|ملغى
Assigned|배정됨|Asignada|Atribuída|Attribué|مُعين
Unscheduled|미배정|Sin programar|Por agendar|Non planifié|غير مجدول
Needs Action|조치 필요|Requiere acción|Requer ação|Action requise|يتطلب إجراءً
Delete Application|신청서 삭제|Eliminar solicitud|Eliminar candidatura|Supprimer la demande|حذف الطلب
No applications found.|신청서가 없습니다.|No se encontraron solicitudes.|Não foram encontradas candidaturas.|Aucune demande trouvée.|لم يتم العثور على طلبات.
Requests|신청 목록|Solicitudes|Pedidos|Demandes|الطلبات
Final Schedule|최종 일정|Horario final|Horário final|Planning définitif|الجدول النهائي
Booking status|예약 상태|Estado de reserva|Estado da reserva|Statut de réservation|حالة الحجز
No requests match this view.|해당하는 신청이 없습니다.|No hay solicitudes para esta vista.|Não há pedidos nesta vista.|Aucune demande dans cette vue.|لا توجد طلبات تطابق هذا العرض.
No appointments assigned yet.|아직 배정된 일정이 없습니다.|Aún no hay citas asignadas.|Ainda não há marcações atribuídas.|Aucun rendez-vous attribué.|لم تُحدد مواعيد بعد.
Copy|복사|Copiar|Copiar|Copier|نسخ
Copy This Day|이 날짜 복사|Copiar este día|Copiar este dia|Copier ce jour|نسخ هذا اليوم
Copy All Days|모든 날짜 복사|Copiar todos los días|Copiar todos os dias|Copier tous les jours|نسخ جميع الأيام
Copy Password|비밀번호 복사|Copiar contraseña|Copiar palavra-passe|Copier le mot de passe|نسخ كلمة المرور
Add Admin|관리자 추가|Añadir administrador|Adicionar administrador|Ajouter un administrateur|إضافة مشرف
Current Admins|현재 관리자|Administradores actuales|Administradores atuais|Administrateurs actuels|المشرفون الحاليون
No admins found.|관리자가 없습니다.|No se encontraron administradores.|Não foram encontrados administradores.|Aucun administrateur trouvé.|لم يتم العثور على مشرفين.
Permissions updated.|권한이 업데이트되었습니다.|Permisos actualizados.|Permissões atualizadas.|Autorisations mises à jour.|تم تحديث الصلاحيات.
All actions|모든 작업|Todas las acciones|Todas as ações|Toutes les actions|جميع الإجراءات
Action|작업|Acción|Ação|Action|الإجراء
Tool|도구|Herramienta|Ferramenta|Outil|الأداة
Time|시간|Hora|Hora|Heure|الوقت
Count|횟수|Cantidad|Contagem|Nombre|العدد
Today|오늘|Hoy|Hoje|Aujourd’hui|اليوم
Last 7 Days|최근 7일|Últimos 7 días|Últimos 7 dias|7 derniers jours|آخر 7 أيام
Last 30 Days|최근 30일|Últimos 30 días|Últimos 30 dias|30 derniers jours|آخر 30 يومًا
Unique Today|오늘 고유 사용자|Usuarios únicos hoy|Utilizadores únicos hoje|Utilisateurs uniques aujourd’hui|المستخدمون الفريدون اليوم
Unique 7 Days|7일 고유 사용자|Usuarios únicos en 7 días|Utilizadores únicos em 7 dias|Utilisateurs uniques sur 7 jours|المستخدمون الفريدون خلال 7 أيام
Unique 30 Days|30일 고유 사용자|Usuarios únicos en 30 días|Utilizadores únicos em 30 dias|Utilisateurs uniques sur 30 jours|المستخدمون الفريدون خلال 30 يومًا
Tools · 30 Days|도구 · 30일|Herramientas · 30 días|Ferramentas · 30 dias|Outils · 30 jours|الأدوات · 30 يومًا
Actions · 30 Days|작업 · 30일|Acciones · 30 días|Ações · 30 dias|Actions · 30 jours|الإجراءات · 30 يومًا
Daily Activity|일별 활동|Actividad diaria|Atividade diária|Activité quotidienne|النشاط اليومي
Recent Events|최근 이벤트|Eventos recientes|Eventos recentes|Événements récents|الأحداث الأخيرة
No matching audit events.|일치하는 감사 이벤트가 없습니다.|No hay eventos coincidentes.|Não há eventos correspondentes.|Aucun événement correspondant.|لا توجد أحداث تدقيق مطابقة.
Search action, admin, player or target|작업, 관리자, 플레이어 또는 대상 검색|Buscar acción, administrador, jugador o destino|Pesquisar ação, administrador, jogador ou alvo|Rechercher action, administrateur, joueur ou cible|ابحث عن إجراء أو مشرف أو لاعب أو هدف
Search player, ID or alliance|플레이어, ID 또는 연맹 검색|Buscar jugador, ID o alianza|Pesquisar jogador, ID ou aliança|Rechercher joueur, identifiant ou alliance|ابحث عن لاعب أو معرّف أو تحالف
Active Gift Codes|사용 가능한 선물 코드|Códigos de regalo activos|Códigos-presente ativos|Codes cadeaux actifs|رموز الهدايا النشطة
Redeem|사용하기|Canjear|Resgatar|Utiliser|استرداد
Redeem Another Code|다른 코드 사용|Canjear otro código|Resgatar outro código|Utiliser un autre code|استرداد رمز آخر
Enter gift code|선물 코드 입력|Introduce un código de regalo|Introduza um código-presente|Saisissez un code cadeau|أدخل رمز الهدية
Enter a valid gift code.|올바른 선물 코드를 입력하세요.|Introduce un código de regalo válido.|Introduza um código-presente válido.|Saisissez un code cadeau valide.|أدخل رمز هدية صالحًا.
Verify your Player ID first.|먼저 플레이어 ID를 인증하세요.|Verifica primero tu ID de jugador.|Verifique primeiro o seu ID de jogador.|Vérifiez d’abord votre identifiant joueur.|تحقق من معرّف اللاعب أولًا.
Redeeming…|사용 중…|Canjeando…|A resgatar…|Utilisation…|جارٍ الاسترداد…
Redeemed|사용 완료|Canjeado|Resgatado|Utilisé|تم الاسترداد
Already Used|이미 사용됨|Ya utilizado|Já utilizado|Déjà utilisé|مستخدم بالفعل
Loading current codes…|현재 코드 불러오는 중…|Cargando códigos actuales…|A carregar códigos atuais…|Chargement des codes actuels…|جارٍ تحميل الرموز الحالية…
Verified State 169 player.|169 왕국 플레이어 인증 완료.|Jugador del Estado 169 verificado.|Jogador do Estado 169 verificado.|Joueur de l’État 169 vérifié.|تم التحقق من لاعب الولاية 169.
No active codes were returned. You can still enter a code manually below.|사용 가능한 코드가 없습니다. 아래에 코드를 직접 입력할 수 있습니다.|No se recibieron códigos activos. Puedes introducir uno abajo.|Não foram recebidos códigos ativos. Pode introduzir um abaixo.|Aucun code actif reçu. Vous pouvez saisir un code ci-dessous.|لم تُرجع رموز نشطة. يمكنك إدخال رمز يدويًا أدناه.
1 · Verify Player|1 · 플레이어 인증|1 · Verificar jugador|1 · Verificar jogador|1 · Vérifier le joueur|1 · التحقق من اللاعب
2 · Buff Tabs|2 · 버프 탭|2 · Pestañas de buffs|2 · Separadores de buffs|2 · Onglets des buffs|2 · علامات التعزيزات
3 · Registered|3 · 등록 완료|3 · Registrado|3 · Registado|3 · Inscrit|3 · مُسجل
Continue to Buff Times|버프 시간 선택으로|Continuar a horarios|Continuar para horários|Continuer vers les horaires|متابعة إلى أوقات التعزيزات
Open My Buffs|내 버프 열기|Abrir mis buffs|Abrir os meus buffs|Ouvrir mes buffs|فتح تعزيزاتي
Change Availability|가능 시간 변경|Cambiar disponibilidad|Alterar disponibilidade|Modifier les disponibilités|تغيير الأوقات المتاحة
Cancel Changes|변경 취소|Cancelar cambios|Cancelar alterações|Annuler les modifications|إلغاء التغييرات
Your submitted availability:|제출한 가능 시간:|Disponibilidad enviada:|Disponibilidade enviada:|Disponibilités envoyées :|الأوقات المتاحة التي أرسلتها:
Your final appointment has not been assigned yet.|아직 최종 일정이 배정되지 않았습니다.|Tu cita final aún no está asignada.|A sua marcação final ainda não foi atribuída.|Votre rendez-vous définitif n’est pas encore attribué.|لم يُحدد موعدك النهائي بعد.
Select at least one suitable time first.|먼저 가능한 시간을 하나 이상 선택하세요.|Selecciona al menos un horario disponible.|Selecione pelo menos um horário disponível.|Sélectionnez au moins un créneau disponible.|حدد وقتًا مناسبًا واحدًا على الأقل أولًا.
Select every time you could genuinely accept this buff.|실제로 이 버프를 받을 수 있는 시간을 모두 선택하세요.|Selecciona todos los horarios en que puedas recibir este buff.|Selecione todos os horários em que pode receber este buff.|Sélectionnez tous les créneaux où vous pouvez recevoir ce buff.|حدد جميع الأوقات التي يمكنك فيها تلقي هذا التعزيز.
Verify the State 169 Prep booking code first.|먼저 169 왕국 Prep 예약 코드를 확인하세요.|Verifica primero el código de reserva Prep del Estado 169.|Verifique primeiro o código Prep do Estado 169.|Vérifiez d’abord le code de réservation Prep de l’État 169.|تحقق أولًا من رمز حجز Prep للولاية 169.
Enter the booking code first.|먼저 예약 코드를 입력하세요.|Introduce primero el código de reserva.|Introduza primeiro o código de reserva.|Saisissez d’abord le code de réservation.|أدخل رمز الحجز أولًا.
Enter a new code|새 코드 입력|Introduce un nuevo código|Introduza um novo código|Saisissez un nouveau code|أدخل رمزًا جديدًا
Code shared by State 169 leadership|169 왕국 지도부가 공유한 코드|Código compartido por los líderes del Estado 169|Código partilhado pela liderança do Estado 169|Code fourni par les dirigeants de l’État 169|الرمز الذي شاركته قيادة الولاية 169
Set New Code|새 코드 설정|Establecer código nuevo|Definir novo código|Définir un nouveau code|تعيين رمز جديد
Clear Code|코드 삭제|Borrar código|Limpar código|Effacer le code|مسح الرمز
Loading booking code status…|예약 코드 상태 불러오는 중…|Cargando estado del código de reserva…|A carregar o estado do código…|Chargement du statut du code…|جارٍ تحميل حالة رمز الحجز…
Could not load booking code status.|예약 코드 상태를 불러올 수 없습니다.|No se pudo cargar el estado del código.|Não foi possível carregar o estado do código.|Impossible de charger le statut du code.|تعذر تحميل حالة رمز الحجز.
Prep booking code copied.|Prep 예약 코드가 복사되었습니다.|Código de reserva Prep copiado.|Código de reserva Prep copiado.|Code de réservation Prep copié.|تم نسخ رمز حجز Prep.
30-minute appointment slots|30분 예약 시간대|Citas de 30 minutos|Marcações de 30 minutos|Créneaux de 30 minutes|فترات مواعيد مدتها 30 دقيقة
⏱ All booking times are Kingshot / UTC · 30-minute slots|⏱ 모든 예약 시간은 Kingshot / UTC · 30분 단위|⏱ Horarios Kingshot / UTC · Intervalos de 30 minutos|⏱ Horários Kingshot / UTC · Intervalos de 30 minutos|⏱ Horaires Kingshot / UTC · Créneaux de 30 minutes|⏱ جميع أوقات الحجز Kingshot / UTC · فترات 30 دقيقة
✓ Registration received|✓ 신청 접수 완료|✓ Registro recibido|✓ Registo recebido|✓ Inscription reçue|✓ تم استلام التسجيل
✓ State 169 player verified.|✓ 169 왕국 플레이어 인증 완료.|✓ Jugador del Estado 169 verificado.|✓ Jogador do Estado 169 verificado.|✓ Joueur de l’État 169 vérifié.|✓ تم التحقق من لاعب الولاية 169.
✓ Player verified and eligible to apply.|✓ 플레이어 인증 완료. 신청 가능합니다.|✓ Jugador verificado y apto para solicitar.|✓ Jogador verificado e elegível.|✓ Joueur vérifié et admissible.|✓ تم التحقق من اللاعب وهو مؤهل للتقديم.
★ Your King's Buff appointment has been assigned|★ 킹스 버프 일정이 배정되었습니다|★ Tu cita de King's Buff está asignada|★ A sua marcação de King's Buff foi atribuída|★ Votre rendez-vous King's Buff est attribué|★ تم تحديد موعد تعزيز الملك الخاص بك
Kingshot Rally Sync|킹스샷 랠리 동기화|Sincronización de rallies Kingshot|Sincronização de rallies Kingshot|Synchronisation des rallies Kingshot|مزامنة تجمعات كينغشوت
＋ Add Rally|＋ 랠리 추가|＋ Añadir rally|＋ Adicionar rally|＋ Ajouter un rally|＋ إضافة تجمع
Pet|펫|Mascota|Animal|Familier|الحيوان الأليف
Pet buff active|펫 버프 활성화|Buff de mascota activo|Buff de animal ativo|Bonus de familier actif|تعزيز الحيوان الأليف نشط
March|행군|Marcha|Marcha|Marche|المسيرة
Delay|지연|Retraso|Atraso|Délai|التأخير
Base rally|기준 랠리|Rally base|Rally base|Rally de base|التجمع الأساسي
⚔️ Calculate Rally Order|⚔️ 랠리 순서 계산|⚔️ Calcular orden de rallies|⚔️ Calcular ordem dos rallies|⚔️ Calculer l’ordre des rallies|⚔️ حساب ترتيب التجمعات
📋 Copy Rally Order|📋 랠리 순서 복사|📋 Copiar orden de rallies|📋 Copiar ordem dos rallies|📋 Copier l’ordre des rallies|📋 نسخ ترتيب التجمعات
▶ Start Visual Timer|▶ 시각 타이머 시작|▶ Iniciar temporizador visual|▶ Iniciar temporizador visual|▶ Démarrer le minuteur visuel|▶ بدء المؤقت المرئي
✏️ Edit|✏️ 편집|✏️ Editar|✏️ Editar|✏️ Modifier|✏️ تعديل
Restart|다시 시작|Reiniciar|Reiniciar|Redémarrer|إعادة التشغيل
Rally order copied.|랠리 순서가 복사되었습니다.|Orden de rallies copiado.|Ordem dos rallies copiada.|Ordre des rallies copié.|تم نسخ ترتيب التجمعات.
Not registered|미등록|Sin registrar|Não registado|Non inscrit|غير مسجل
✓ Registered|✓ 등록 완료|✓ Registrado|✓ Registado|✓ Inscrit|✓ مسجل
{count} times selected|선택한 시간: {count}개|Horarios seleccionados: {count}|Horários selecionados: {count}|Créneaux sélectionnés : {count}|عدد الأوقات المحددة: {count}
{done} of {total} buff registrations completed|버프 신청 {total}개 중 {done}개 완료|{done} de {total} registros completados|{done} de {total} registos concluídos|{done} inscriptions sur {total} terminées|اكتمل {done} من {total} تسجيلات التعزيز
SAVE NEW AVAILABILITY|새 가능 시간 저장|GUARDAR DISPONIBILIDAD|GUARDAR DISPONIBILIDADE|ENREGISTRER LES DISPONIBILITÉS|حفظ الأوقات المتاحة الجديدة
APPLY FOR {buff}|{buff} 신청|SOLICITAR {buff}|CANDIDATAR A {buff}|DEMANDER {buff}|التقديم على {buff}
Redeeming {code}…|{code} 사용 중…|Canjeando {code}…|A resgatar {code}…|Utilisation de {code}…|جارٍ استرداد {code}…
Player ID|플레이어 ID|ID de jugador|ID de jogador|Identifiant joueur|معرّف اللاعب
Status filter|상태 필터|Filtro de estado|Filtro de estado|Filtre de statut|تصفية الحالة
e.g. 24649596|예: 24649596|p. ej. 24649596|ex.: 24649596|ex. 24649596|مثال: 24649596
24649596 or your existing email|24649596 또는 기존 이메일|24649596 o tu correo actual|24649596 ou o seu email atual|24649596 ou votre e-mail actuel|24649596 أو بريدك الإلكتروني الحالي
Verify your Kingshot profile, then complete the short application.|킹스샷 프로필을 인증한 후 간단한 신청서를 작성하세요.|Verifica tu perfil de Kingshot y completa la solicitud.|Verifique o seu perfil de Kingshot e preencha a candidatura.|Vérifiez votre profil Kingshot, puis remplissez la demande.|تحقق من ملف كينغشوت ثم أكمل الطلب القصير.
I understand this application and my verified Kingshot profile information will be shared with authorised State 169 leadership for transfer review.|이 신청서와 인증된 킹스샷 프로필 정보가 이전 검토를 위해 권한 있는 169 왕국 지도부에 공유됨을 이해합니다.|Entiendo que esta solicitud y mi perfil verificado se compartirán con los líderes autorizados del Estado 169 para revisar mi transferencia.|Compreendo que esta candidatura e o meu perfil verificado serão partilhados com a liderança autorizada do Estado 169 para avaliar a transferência.|Je comprends que cette demande et mon profil vérifié seront partagés avec les dirigeants autorisés de l’État 169 pour examiner mon transfert.|أفهم أن هذا الطلب ومعلومات ملفي المعتمد في كينغشوت ستُشارك مع قيادة الولاية 169 المخولة لمراجعة الانتقال.
Tell us every time that genuinely works for you. State 169 leadership will choose one final appointment from your selections.|실제로 가능한 시간을 모두 알려주세요. 169 왕국 지도부가 선택한 시간 중 하나를 최종 배정합니다.|Indica todos tus horarios disponibles. Los líderes del Estado 169 elegirán una cita entre tus opciones.|Indique todos os horários disponíveis. A liderança do Estado 169 escolherá uma marcação entre as suas opções.|Indiquez tous vos créneaux disponibles. Les dirigeants de l’État 169 en choisiront un pour votre rendez-vous.|حدد جميع الأوقات المناسبة لك. ستختار قيادة الولاية 169 موعدًا نهائيًا من اختياراتك.
Verify your State 169 Kingshot profile|169 왕국 킹스샷 프로필 인증|Verifica tu perfil del Estado 169|Verifique o seu perfil do Estado 169|Vérifiez votre profil de l’État 169|تحقق من ملفك في الولاية 169
We’ll show the verified profile first. Only State 169 players can continue to buff time selection.|인증된 프로필을 먼저 표시합니다. 169 왕국 플레이어만 버프 시간을 선택할 수 있습니다.|Primero se mostrará el perfil verificado. Solo los jugadores del Estado 169 pueden elegir horarios.|Primeiro será mostrado o perfil verificado. Só jogadores do Estado 169 podem escolher horários.|Le profil vérifié s’affichera d’abord. Seuls les joueurs de l’État 169 peuvent choisir des créneaux.|سنعرض الملف المعتمد أولًا. يمكن فقط للاعبي الولاية 169 متابعة اختيار أوقات التعزيز.
State 169 Prep Booking Code|169 왕국 Prep 예약 코드|Código de reserva Prep del Estado 169|Código de reserva Prep do Estado 169|Code de réservation Prep de l’État 169|رمز حجز Prep للولاية 169
New Prep Booking Code|새 Prep 예약 코드|Nuevo código de reserva Prep|Novo código de reserva Prep|Nouveau code de réservation Prep|رمز حجز Prep الجديد
Enter the private Prep code once to register and view your existing King's Buff bookings.|비공개 Prep 코드를 한 번 입력하여 신청하고 기존 킹스 버프 예약을 확인하세요.|Introduce el código privado Prep para registrarte y consultar tus reservas de King's Buff.|Introduza o código privado Prep para se registar e consultar as suas reservas de King's Buff.|Saisissez le code privé Prep pour vous inscrire et consulter vos réservations de King's Buff.|أدخل رمز Prep الخاص مرة واحدة للتسجيل وعرض حجوزات تعزيزات الملك الحالية.
every 30-minute time that genuinely works|실제로 가능한 모든 30분 시간대|todos los intervalos de 30 minutos disponibles|todos os intervalos de 30 minutos disponíveis|tous les créneaux de 30 minutes disponibles|كل فترة 30 دقيقة مناسبة لك فعلًا
Data supplied by MightPulse. Responses may be cached by MightPulse.|MightPulse 제공 데이터입니다. 응답은 MightPulse에서 캐시될 수 있습니다.|Datos de MightPulse. Las respuestas pueden estar almacenadas en caché.|Dados da MightPulse. As respostas podem estar em cache.|Données fournies par MightPulse. Les réponses peuvent être mises en cache.|البيانات مقدمة من MightPulse. قد تُخزن الردود مؤقتًا لدى MightPulse.
Verify your State 169 Player ID, then redeem current Kingshot gift codes individually.|169 왕국 플레이어 ID를 인증한 후 현재 킹스샷 선물 코드를 개별 사용하세요.|Verifica tu ID del Estado 169 y canjea los códigos de regalo individualmente.|Verifique o seu ID do Estado 169 e resgate os códigos individualmente.|Vérifiez votre identifiant de l’État 169, puis utilisez les codes cadeaux individuellement.|تحقق من معرّف لاعب الولاية 169 ثم استرد رموز هدايا كينغشوت كلًا على حدة.
Codes are redeemed one at a time. There is no alliance-wide or background auto-redemption.|코드는 한 번에 하나씩 사용됩니다. 연맹 전체 또는 백그라운드 자동 사용은 없습니다.|Los códigos se canjean uno a uno. No hay canje automático para toda la alianza ni en segundo plano.|Os códigos são resgatados um de cada vez. Não há resgate automático para a aliança ou em segundo plano.|Les codes sont utilisés un par un. Aucune utilisation automatique pour l’alliance ou en arrière-plan.|تُسترد الرموز واحدًا تلو الآخر. لا يوجد استرداد تلقائي للتحالف بأكمله أو في الخلفية.
Use your Kingshot Player ID. Existing legacy admins may also use their original email address.|킹스샷 플레이어 ID를 사용하세요. 기존 관리자는 원래 이메일 주소도 사용할 수 있습니다.|Usa tu ID de jugador de Kingshot. Los administradores antiguos también pueden usar su correo original.|Use o seu ID de jogador de Kingshot. Os administradores antigos também podem usar o email original.|Utilisez votre identifiant joueur Kingshot. Les anciens administrateurs peuvent aussi utiliser leur e-mail d’origine.|استخدم معرّف لاعب كينغشوت. يمكن للمشرفين القدامى أيضًا استخدام بريدهم الإلكتروني الأصلي.
New admin accounts use Player ID login. Older admin accounts can continue using their original email until they are converted from Admin Users.|새 관리자 계정은 플레이어 ID로 로그인합니다. 기존 계정은 관리자 계정 페이지에서 전환할 때까지 원래 이메일을 사용할 수 있습니다.|Las cuentas nuevas usan el ID de jugador. Las antiguas pueden usar su correo hasta convertirse desde Administradores.|As contas novas usam o ID de jogador. As antigas podem usar o email até serem convertidas em Administradores.|Les nouveaux comptes utilisent l’identifiant joueur. Les anciens peuvent garder leur e-mail jusqu’à leur conversion dans Administrateurs.|تستخدم الحسابات الجديدة معرّف اللاعب. يمكن للحسابات القديمة استخدام بريدها حتى تحويلها من صفحة المشرفين.
Recent privileged actions across State 169 tools.|169 왕국 도구의 최근 관리자 작업입니다.|Acciones privilegiadas recientes en las herramientas del Estado 169.|Ações privilegiadas recentes nas ferramentas do Estado 169.|Actions privilégiées récentes dans les outils de l’État 169.|الإجراءات الإدارية الأخيرة في أدوات الولاية 169.
Fast booking control for KVK Prep · all times Kingshot / UTC|KVK Prep 빠른 예약 관리 · 모든 시간 Kingshot / UTC|Gestión de reservas KVK Prep · Horarios Kingshot / UTC|Gestão de reservas KVK Prep · Horários Kingshot / UTC|Gestion des réservations KVK Prep · Horaires Kingshot / UTC|إدارة حجوزات KVK Prep · جميع الأوقات Kingshot / UTC
Only the super-admin can change or clear the code. King’s Buff admins can view and copy it.|최고 관리자만 코드를 변경하거나 삭제할 수 있습니다. 킹스 버프 관리자는 확인하고 복사할 수 있습니다.|Solo el superadministrador puede cambiar o borrar el código. Los administradores de King's Buff pueden verlo y copiarlo.|Só o superadministrador pode alterar ou limpar o código. Os administradores de King's Buff podem vê-lo e copiá-lo.|Seul le super-administrateur peut modifier ou effacer le code. Les administrateurs de King's Buff peuvent le voir et le copier.|يمكن للمشرف الأعلى فقط تغيير الرمز أو مسحه. ويمكن لمشرفي تعزيزات الملك عرضه ونسخه.
Privacy-conscious aggregate usage · 90-day retention|개인정보 보호 집계 사용량 · 90일 보관|Uso agregado con privacidad · Retención de 90 días|Utilização agregada com privacidade · Retenção de 90 dias|Utilisation agrégée respectant la vie privée · Conservation de 90 jours|استخدام إجمالي يراعي الخصوصية · احتفاظ لمدة 90 يومًا
Create State 169 admin accounts and give each person only the tools they need.|169 왕국 관리자 계정을 만들고 필요한 도구만 부여하세요.|Crea cuentas de administración del Estado 169 y asigna solo las herramientas necesarias.|Crie contas de administração do Estado 169 e atribua apenas as ferramentas necessárias.|Créez des comptes administrateurs pour l’État 169 et attribuez uniquement les outils nécessaires.|أنشئ حسابات مشرفين للولاية 169 وامنح كل شخص الأدوات التي يحتاجها فقط.
Login will use this Player ID. No personal email is required.|이 플레이어 ID로 로그인합니다. 개인 이메일은 필요하지 않습니다.|El acceso usará este ID. No se necesita correo personal.|O login usará este ID. Não é necessário email pessoal.|La connexion utilisera cet identifiant. Aucun e-mail personnel n’est requis.|سيستخدم تسجيل الدخول معرّف اللاعب هذا. لا يلزم بريد إلكتروني شخصي.
R4 / Player Search|R4 / 플레이어 검색|R4 / Búsqueda de jugadores|R4 / Pesquisa de jogadores|R4 / Recherche de joueurs|R4 / البحث عن اللاعبين
MoJ / King's Buffs|MoJ / 킹스 버프|MoJ / King's Buffs|MoJ / King's Buffs|MoJ / King's Buffs|MoJ / تعزيزات الملك
Full Operational Admin|전체 운영 관리자|Administrador operativo completo|Administrador operacional completo|Administrateur opérationnel complet|مشرف بكامل صلاحيات التشغيل
Verify State 169 & Create Admin|169 왕국 인증 및 관리자 생성|Verificar Estado 169 y crear administrador|Verificar Estado 169 e criar administrador|Vérifier l’État 169 et créer un administrateur|التحقق من الولاية 169 وإنشاء مشرف
Temporary password — shown once|임시 비밀번호 — 한 번만 표시|Contraseña temporal — se muestra una vez|Palavra-passe temporária — mostrada uma vez|Mot de passe temporaire — affiché une seule fois|كلمة مرور مؤقتة — تُعرض مرة واحدة
Send this securely. They will be forced to choose a new password at first login.|안전하게 전달하세요. 첫 로그인 시 새 비밀번호를 설정해야 합니다.|Envíala de forma segura. Será obligatorio cambiarla al iniciar sesión por primera vez.|Envie-a com segurança. Será obrigatório alterá-la no primeiro login.|Transmettez-le de manière sécurisée. Son changement sera obligatoire à la première connexion.|أرسلها بأمان. سيُلزم المستخدم باختيار كلمة مرور جديدة عند الدخول الأول.
You can change these times until the MoJ/Admin assigns your final appointment.|MoJ/관리자가 최종 일정을 배정하기 전까지 시간을 변경할 수 있습니다.|Puedes cambiar los horarios hasta que MoJ/administración asigne tu cita final.|Pode alterar os horários até MoJ/administração atribuir a marcação final.|Vous pouvez modifier les créneaux jusqu’à l’attribution du rendez-vous définitif par MoJ/administration.|يمكنك تغيير الأوقات حتى يحدد MoJ/المشرف موعدك النهائي.
This registration is locked because a final appointment has been assigned. Contact State 169 leadership if it needs changing.|최종 일정이 배정되어 신청이 잠겼습니다. 변경이 필요하면 169 왕국 지도부에 문의하세요.|Este registro está bloqueado porque ya tiene cita final. Contacta con los líderes del Estado 169 para cambiarlo.|Este registo está bloqueado porque tem uma marcação final. Contacte a liderança do Estado 169 para alterações.|Cette inscription est verrouillée car un rendez-vous définitif est attribué. Contactez les dirigeants de l’État 169 pour le modifier.|هذا التسجيل مقفل لتحديد موعد نهائي. تواصل مع قيادة الولاية 169 إذا احتاج إلى تغيير.
Enter each rally lead's march time. The slowest march becomes the base rally; everyone else launches after the calculated delay so all rallies land together.|각 랠리장의 행군 시간을 입력하세요. 가장 느린 행군이 기준 랠리가 되며 나머지는 계산된 지연 후 출발하여 함께 도착합니다.|Introduce el tiempo de marcha de cada líder. La marcha más lenta será el rally base; los demás saldrán con el retraso calculado para llegar juntos.|Introduza o tempo de marcha de cada líder. A marcha mais lenta será o rally base; os restantes partem após o atraso calculado para chegarem juntos.|Saisissez le temps de marche de chaque chef. La marche la plus lente sera le rally de base ; les autres partiront après le délai calculé pour arriver ensemble.|أدخل وقت مسيرة كل قائد تجمع. تصبح أبطأ مسيرة التجمع الأساسي، وينطلق الآخرون بعد التأخير المحسوب لتصل التجمعات معًا.
Create base rally now|지금 기준 랠리 생성|Crea el rally base ahora|Crie o rally base agora|Créez le rally de base maintenant|أنشئ التجمع الأساسي الآن
Next rally|다음 랠리|Siguiente rally|Próximo rally|Prochain rally|التجمع التالي
All rallies launched|모든 랠리 출발 완료|Todos los rallies han salido|Todos os rallies partiram|Tous les rallies sont lancés|انطلقت جميع التجمعات
Total Power|총 전투력|Poder total|Poder total|Puissance totale|القوة الإجمالية
Average Power|평균 전투력|Poder medio|Poder médio|Puissance moyenne|متوسط القوة
Power Rank|전투력 순위|Clasificación de poder|Classificação de poder|Classement de puissance|تصنيف القوة
Players|플레이어 수|Jugadores|Jogadores|Joueurs|اللاعبون
Alliances|연맹 수|Alianzas|Alianças|Alliances|التحالفات
Kingdom Age|왕국 나이|Antigüedad del reino|Idade do reino|Âge du royaume|عمر المملكة
Migrant Score|이전 점수|Puntuación de migración|Pontuação de migração|Score de migration|نقاط الهجرة
Active Players · 7d|활성 플레이어 · 7일|Jugadores activos · 7 días|Jogadores ativos · 7 dias|Joueurs actifs · 7 jours|اللاعبون النشطون · 7 أيام
Active Players · 30d|활성 플레이어 · 30일|Jugadores activos · 30 días|Jogadores ativos · 30 dias|Joueurs actifs · 30 jours|اللاعبون النشطون · 30 يومًا
Activity Rank|활동 순위|Clasificación de actividad|Classificação de atividade|Classement d’activité|تصنيف النشاط
7-Day Power Gain|7일 전투력 증가|Aumento de poder en 7 días|Ganho de poder em 7 dias|Gain de puissance sur 7 jours|زيادة القوة خلال 7 أيام
TC Pushers · 7d|TC 성장 플레이어 · 7일|Mejoras de TC · 7 días|Melhorias de TC · 7 dias|Progressions TC · 7 jours|ترقيات TC · 7 أيام
Alliance Power|연맹 전투력|Poder de alianza|Poder da aliança|Puissance d’alliance|قوة التحالف
Troop Power|병력 전투력|Poder de tropas|Poder das tropas|Puissance des troupes|قوة القوات
Research Power|연구 전투력|Poder de investigación|Poder de pesquisa|Puissance de recherche|قوة البحث
Building Power|건물 전투력|Poder de edificios|Poder de edifícios|Puissance des bâtiments|قوة المباني
Hero Power|영웅 전투력|Poder de héroes|Poder de heróis|Puissance des héros|قوة الأبطال
Governor Charms|영주 보석|Amuletos del gobernador|Amuletos do governador|Charmes du gouverneur|تعويذات الحاكم
Pet Power|펫 전투력|Poder de mascotas|Poder de animais|Puissance des familiers|قوة الحيوانات الأليفة
Delete|삭제|Eliminar|Eliminar|Supprimer|حذف
Copy ID|ID 복사|Copiar ID|Copiar ID|Copier l’identifiant|نسخ المعرّف
Mark Completed|완료로 표시|Marcar completada|Marcar como concluída|Marquer comme terminé|وضع علامة مكتمل
Reset Password|비밀번호 재설정|Restablecer contraseña|Repor palavra-passe|Réinitialiser le mot de passe|إعادة تعيين كلمة المرور
Convert to Player ID Login|플레이어 ID 로그인으로 전환|Convertir a acceso con ID|Converter para login com ID|Convertir en connexion par identifiant|التحويل إلى الدخول بمعرّف اللاعب
Create a new temporary password for this admin?|이 관리자의 새 임시 비밀번호를 생성할까요?|¿Crear una contraseña temporal para este administrador?|Criar uma palavra-passe temporária para este administrador?|Créer un mot de passe temporaire pour cet administrateur ?|إنشاء كلمة مرور مؤقتة جديدة لهذا المشرف؟
Permanently delete admin account for {name}?|{name}의 관리자 계정을 영구 삭제할까요?|¿Eliminar permanentemente la cuenta de {name}?|Eliminar permanentemente a conta de {name}?|Supprimer définitivement le compte administrateur de {name} ?|حذف حساب المشرف {name} نهائيًا؟
Delete the transfer application for {name}? This cannot be undone.|{name}의 이전 신청서를 삭제할까요? 취소할 수 없습니다.|¿Eliminar la solicitud de {name}? No se puede deshacer.|Eliminar a candidatura de {name}? Não é possível anular.|Supprimer la demande de transfert de {name} ? Cette action est irréversible.|حذف طلب انتقال {name}؟ لا يمكن التراجع عن ذلك.
Delete King's Buff request for {name}?|{name}의 킹스 버프 신청을 삭제할까요?|¿Eliminar la solicitud de King's Buff de {name}?|Eliminar o pedido de King's Buff de {name}?|Supprimer la demande de King's Buff de {name} ?|حذف طلب تعزيز الملك الخاص بـ {name}؟
Convert this legacy admin to Player ID {id} login? Their existing password will stay the same.|이 기존 관리자를 플레이어 ID {id} 로그인으로 전환할까요? 기존 비밀번호는 유지됩니다.|¿Convertir esta cuenta al acceso con ID {id}? Su contraseña no cambiará.|Converter esta conta para login com ID {id}? A palavra-passe será mantida.|Convertir cet administrateur en connexion par identifiant {id} ? Son mot de passe restera inchangé.|تحويل هذا المشرف القديم إلى الدخول بمعرّف اللاعب {id}؟ ستبقى كلمة المرور الحالية كما هي.
Clear the current Prep booking code? Public Prep bookings will be blocked until you set a new code.|현재 Prep 예약 코드를 삭제할까요? 새 코드를 설정할 때까지 공개 Prep 예약이 차단됩니다.|¿Borrar el código Prep actual? Las reservas públicas se bloquearán hasta establecer otro.|Limpar o código Prep atual? As reservas públicas ficarão bloqueadas até definir outro.|Effacer le code Prep actuel ? Les réservations publiques seront bloquées jusqu’à la définition d’un nouveau code.|مسح رمز حجز Prep الحالي؟ ستُحظر حجوزات Prep العامة حتى تعيين رمز جديد.
Temporary password copied.|임시 비밀번호가 복사되었습니다.|Contraseña temporal copiada.|Palavra-passe temporária copiada.|Mot de passe temporaire copié.|تم نسخ كلمة المرور المؤقتة.
Enter the State 169 Player ID first.|먼저 169 왕국 플레이어 ID를 입력하세요.|Introduce primero el ID de jugador del Estado 169.|Introduza primeiro o ID de jogador do Estado 169.|Saisissez d’abord l’identifiant joueur de l’État 169.|أدخل معرّف لاعب الولاية 169 أولًا.
No hero gear returned.|영웅 장비가 반환되지 않았습니다.|No se recibió equipo de héroes.|Não foi recebido equipamento de heróis.|Aucun équipement de héros reçu.|لم تُرجع معدات أبطال.
No governor gear data returned.|영주 장비 데이터가 반환되지 않았습니다.|No se recibieron datos de equipo del gobernador.|Não foram recebidos dados do equipamento do governador.|Aucune donnée d’équipement du gouverneur reçue.|لم تُرجع بيانات معدات الحاكم.
No governor gear items returned.|영주 장비 항목이 반환되지 않았습니다.|No se recibieron piezas de equipo del gobernador.|Não foram recebidas peças do equipamento do governador.|Aucune pièce d’équipement du gouverneur reçue.|لم تُرجع قطع معدات الحاكم.
No hero data returned.|영웅 데이터가 반환되지 않았습니다.|No se recibieron datos de héroes.|Não foram recebidos dados de heróis.|Aucune donnée de héros reçue.|لم تُرجع بيانات أبطال.
No ranking data returned.|순위 데이터가 반환되지 않았습니다.|No se recibieron clasificaciones.|Não foram recebidas classificações.|Aucun classement reçu.|لم تُرجع بيانات تصنيف.
Your admin login session could not be found. Return to Admin Login and sign in again.|관리자 로그인 세션을 찾을 수 없습니다. 관리자 로그인으로 돌아가 다시 로그인하세요.|No se encontró tu sesión. Vuelve al acceso de administración e inicia sesión.|A sessão não foi encontrada. Volte ao login de administração e entre novamente.|Votre session est introuvable. Retournez à la connexion administrateur et reconnectez-vous.|تعذر العثور على جلسة الإدارة. عد إلى تسجيل دخول الإدارة وسجل مجددًا.
Password updated successfully. Returning you to Admin Login…|비밀번호가 변경되었습니다. 관리자 로그인으로 돌아갑니다…|Contraseña actualizada. Volviendo al acceso de administración…|Palavra-passe atualizada. A voltar ao login de administração…|Mot de passe mis à jour. Retour à la connexion administrateur…|تم تحديث كلمة المرور. جارٍ العودة إلى تسجيل دخول الإدارة…
The password service did not respond within 15 seconds. Please tell the super-admin.|비밀번호 서비스가 15초 이내에 응답하지 않았습니다. 최고 관리자에게 알려주세요.|El servicio no respondió en 15 segundos. Avisa al superadministrador.|O serviço não respondeu em 15 segundos. Avise o superadministrador.|Le service n’a pas répondu sous 15 secondes. Prévenez le super-administrateur.|لم تستجب خدمة كلمات المرور خلال 15 ثانية. أبلغ المشرف الأعلى.
Copied schedule with Player IDs.|플레이어 ID가 포함된 일정을 복사했습니다.|Horario copiado con IDs de jugadores.|Horário copiado com IDs de jogadores.|Planning copié avec les identifiants joueurs.|تم نسخ الجدول مع معرّفات اللاعبين.
Could not copy automatically. Press and hold the code to copy it.|자동 복사에 실패했습니다. 코드를 길게 눌러 복사하세요.|No se pudo copiar automáticamente. Mantén pulsado el código para copiarlo.|Não foi possível copiar automaticamente. Mantenha o código premido para copiar.|Copie automatique impossible. Maintenez le code appuyé pour le copier.|تعذر النسخ تلقائيًا. اضغط مطولًا على الرمز لنسخه.
🔐 Prep Booking Security|🔐 Prep 예약 보안|🔐 Seguridad de reservas Prep|🔐 Segurança de reservas Prep|🔐 Sécurité des réservations Prep|🔐 أمان حجوزات Prep
The current code was created before code-reveal support was added. Set it once more from the super-admin account to make it viewable.|현재 코드는 코드 표시 기능이 추가되기 전에 생성되었습니다. 최고 관리자 계정에서 다시 설정하면 표시됩니다.|El código se creó antes de poder mostrarlo. Vuelve a establecerlo desde la cuenta del superadministrador.|O código foi criado antes do suporte de visualização. Defina-o novamente na conta do superadministrador.|Ce code précède la fonction d’affichage. Redéfinissez-le depuis le compte du super-administrateur pour le rendre visible.|أُنشئ الرمز قبل دعم عرضه. أعد تعيينه من حساب المشرف الأعلى لجعله قابلًا للعرض.
✓ All three King's Buff registrations are complete. You can return here later to see your assigned times.|✓ 세 가지 킹스 버프 신청이 완료되었습니다. 나중에 돌아와 배정된 시간을 확인하세요.|✓ Las tres inscripciones están completas. Vuelve más tarde para ver los horarios asignados.|✓ As três inscrições estão concluídas. Volte mais tarde para ver os horários atribuídos.|✓ Les trois inscriptions sont terminées. Revenez plus tard pour voir les horaires attribués.|✓ اكتملت تسجيلات تعزيزات الملك الثلاثة. يمكنك العودة لاحقًا لمعرفة الأوقات المحددة.
This account is already in State 169, so it cannot apply to transfer into State 169.|이미 169 왕국에 있는 계정이므로 169 왕국으로 이전 신청할 수 없습니다.|Esta cuenta ya está en el Estado 169 y no puede solicitar transferirse aquí.|Esta conta já está no Estado 169 e não pode candidatar-se à transferência.|Ce compte est déjà dans l’État 169 et ne peut pas demander à y être transféré.|هذا الحساب موجود بالفعل في الولاية 169 ولا يمكنه طلب الانتقال إليها.
This account is already in State 169 and cannot submit a transfer application.|이미 169 왕국에 있는 계정이므로 이전 신청서를 제출할 수 없습니다.|Esta cuenta ya está en el Estado 169 y no puede enviar una solicitud.|Esta conta já está no Estado 169 e não pode enviar uma candidatura.|Ce compte est déjà dans l’État 169 et ne peut pas soumettre de demande de transfert.|هذا الحساب موجود بالفعل في الولاية 169 ولا يمكنه تقديم طلب انتقال.
`;
const result={ko:{},es:{},pt:{},fr:{},ar:{}};
const extraRows=`
March time accepts 45, 1:05, 1m 5s, or 00:01:05. Use a fake rally in-game to measure each lead's march time to the target.|행군 시간은 45, 1:05, 1m 5s 또는 00:01:05 형식으로 입력할 수 있습니다. 게임에서 가짜 랠리로 각 랠리장의 목표까지 행군 시간을 측정하세요.|El tiempo de marcha admite 45, 1:05, 1m 5s o 00:01:05. Usa un rally ficticio en el juego para medir la marcha de cada líder al objetivo.|O tempo de marcha aceita 45, 1:05, 1m 5s ou 00:01:05. Use um rally fictício no jogo para medir a marcha de cada líder até ao alvo.|Le temps de marche accepte 45, 1:05, 1m 5s ou 00:01:05. Utilisez un faux rally en jeu pour mesurer la marche de chaque chef jusqu’à la cible.|يقبل وقت المسيرة 45 أو 1:05 أو 1m 5s أو 00:01:05. استخدم تجمعًا وهميًا داخل اللعبة لقياس وقت مسيرة كل قائد إلى الهدف.
Unnamed|이름 없음|Sin nombre|Sem nome|Sans nom|بلا اسم
Invalid march time for {name}. Try 45, 1:05, or 1m 5s.|{name}의 행군 시간이 올바르지 않습니다. 45, 1:05 또는 1m 5s를 입력하세요.|Tiempo de marcha no válido para {name}. Prueba 45, 1:05 o 1m 5s.|Tempo de marcha inválido para {name}. Experimente 45, 1:05 ou 1m 5s.|Temps de marche incorrect pour {name}. Essayez 45, 1:05 ou 1m 5s.|وقت المسيرة لـ {name} غير صالح. جرّب 45 أو 1:05 أو 1m 5s.
Invalid march time. Try 45, 1:05, or 1m 5s.|행군 시간이 올바르지 않습니다. 45, 1:05 또는 1m 5s를 입력하세요.|Tiempo de marcha no válido. Prueba 45, 1:05 o 1m 5s.|Tempo de marcha inválido. Experimente 45, 1:05 ou 1m 5s.|Temps de marche incorrect. Essayez 45, 1:05 ou 1m 5s.|وقت المسيرة غير صالح. جرّب 45 أو 1:05 أو 1m 5s.
Add at least two rallies to sync.|동기화할 랠리를 두 개 이상 추가하세요.|Añade al menos dos rallies para sincronizar.|Adicione pelo menos dois rallies para sincronizar.|Ajoutez au moins deux rallies à synchroniser.|أضف تجمعين على الأقل للمزامنة.
⚔️ KVK RALLY SYNC|⚔️ KVK 랠리 동기화|⚔️ SINCRONIZACIÓN DE RALLIES KVK|⚔️ SINCRONIZAÇÃO DE RALLIES KVK|⚔️ SYNCHRONISATION DES RALLIES KVK|⚔️ مزامنة تجمعات KVK
BASE|기준|BASE|BASE|BASE|الأساس
{name} — GO|{name} — 출발|{name} — SALIR|{name} — PARTIR|{name} — PARTEZ|{name} — انطلق
+{delay} {name}|+{delay} {name}|+{delay} {name}|+{delay} {name}|+{delay} {name}|+{delay} {name}
Slowest march: {time}|가장 느린 행군: {time}|Marcha más lenta: {time}|Marcha mais lenta: {time}|Marche la plus lente : {time}|أبطأ مسيرة: {time}
{names} starts the base rally|{names}이(가) 기준 랠리를 시작합니다|{names} inicia el rally base|{names} inicia o rally base|{names} lance le rally de base|{names} يبدأ التجمع الأساسي
Choose one base rally: {names}|기준 랠리 하나를 선택하세요: {names}|Elige un rally base: {names}|Escolha um rally base: {names}|Choisissez un rally de base : {names}|اختر تجمعًا أساسيًا واحدًا: {names}
Slowest march is {time}. Launch each remaining rally after the delay shown.|가장 느린 행군은 {time}입니다. 나머지 랠리는 표시된 지연 후 출발하세요.|La marcha más lenta es {time}. Lanza cada rally restante tras el retraso indicado.|A marcha mais lenta é {time}. Lance cada rally restante após o atraso indicado.|La marche la plus lente dure {time}. Lancez chaque autre rally après le délai indiqué.|أبطأ مسيرة تستغرق {time}. أطلق كل تجمع متبقٍ بعد التأخير الموضح.
BASE RALLY|기준 랠리|RALLY BASE|RALLY BASE|RALLY DE BASE|التجمع الأساسي
GO|출발|SALIR|PARTIR|PARTEZ|انطلق
Next launch timing begins now.|다음 출발 시간 측정을 시작합니다.|El tiempo para el siguiente lanzamiento empieza ahora.|A contagem para a próxima partida começa agora.|Le décompte du prochain départ commence maintenant.|يبدأ توقيت الانطلاق التالي الآن.
in {time}|{time} 후|en {time}|em {time}|dans {time}|بعد {time}
Elapsed: {time}|경과: {time}|Transcurrido: {time}|Decorrido: {time}|Écoulé : {time}|المنقضي: {time}
DONE|완료|HECHO|CONCLUÍDO|TERMINÉ|تم
ALL SENT|모두 출발|TODOS ENVIADOS|TODOS ENVIADOS|TOUS ENVOYÉS|تم إرسال الجميع
Rally sync complete|랠리 동기화 완료|Sincronización completada|Sincronização concluída|Synchronisation terminée|اكتملت مزامنة التجمعات
Comparison failed ({status}).|비교에 실패했습니다 ({status}).|La comparación falló ({status}).|A comparação falhou ({status}).|La comparaison a échoué ({status}).|فشلت المقارنة ({status}).
Could not compare kingdoms.|왕국을 비교할 수 없습니다.|No se pudieron comparar los reinos.|Não foi possível comparar os reinos.|Impossible de comparer les royaumes.|تعذرت مقارنة الممالك.
Health: {health}|상태: {health}|Salud: {health}|Saúde: {health}|Santé : {health}|الحالة: {health}
Could not verify player.|플레이어를 인증할 수 없습니다.|No se pudo verificar al jugador.|Não foi possível verificar o jogador.|Impossible de vérifier le joueur.|تعذر التحقق من اللاعب.
Gift redemption here is currently for State 169 players. This ID is in State {state}.|현재 선물 코드 사용은 169 왕국 플레이어만 가능합니다. 이 ID는 {state} 왕국에 있습니다.|El canje está disponible actualmente para jugadores del Estado 169. Este ID está en el Estado {state}.|O resgate está atualmente disponível para jogadores do Estado 169. Este ID está no Estado {state}.|L’utilisation des codes est actuellement réservée aux joueurs de l’État 169. Cet identifiant est dans l’État {state}.|استرداد الهدايا هنا متاح حاليًا للاعبي الولاية 169. هذا المعرّف في الولاية {state}.
[{alliance}] · State 169 · ID {id}|[{alliance}] · 왕국 169 · ID {id}|[{alliance}] · Estado 169 · ID {id}|[{alliance}] · Estado 169 · ID {id}|[{alliance}] · État 169 · ID {id}|[{alliance}] · الولاية 169 · المعرّف {id}
State 169 · ID {id}|왕국 169 · ID {id}|Estado 169 · ID {id}|Estado 169 · ID {id}|État 169 · ID {id}|الولاية 169 · المعرّف {id}
Active|활성|Activo|Ativo|Actif|نشط
Could not load gift codes.|선물 코드를 불러올 수 없습니다.|No se pudieron cargar los códigos de regalo.|Não foi possível carregar os códigos-presente.|Impossible de charger les codes cadeaux.|تعذر تحميل رموز الهدايا.
Could not load codes.|코드를 불러올 수 없습니다.|No se pudieron cargar los códigos.|Não foi possível carregar os códigos.|Impossible de charger les codes.|تعذر تحميل الرموز.
{error} You can still enter a code manually below.|{error} 아래에 코드를 직접 입력할 수 있습니다.|{error} Puedes introducir un código manualmente abajo.|{error} Pode introduzir um código manualmente abaixo.|{error} Vous pouvez toujours saisir un code manuellement ci-dessous.|{error} يمكنك إدخال رمز يدويًا أدناه.
Redemption failed.|코드 사용에 실패했습니다.|El canje falló.|O resgate falhou.|L’utilisation du code a échoué.|فشل الاسترداد.
Gift code processed.|선물 코드가 처리되었습니다.|Código de regalo procesado.|Código-presente processado.|Code cadeau traité.|تمت معالجة رمز الهدية.
Could not redeem gift code.|선물 코드를 사용할 수 없습니다.|No se pudo canjear el código de regalo.|Não foi possível resgatar o código-presente.|Impossible d’utiliser le code cadeau.|تعذر استرداد رمز الهدية.
Power {power} · TC {level}|전투력 {power} · TC {level}|Poder {power} · TC {level}|Poder {power} · TC {level}|Puissance {power} · TC {level}|القوة {power} · TC {level}
Choose a buff day at the top. Select every 30-minute time that genuinely works, then press Apply. Completed registrations are marked automatically.|상단에서 버프 날짜를 선택하세요. 실제로 가능한 모든 30분 시간대를 선택한 후 신청을 누르세요. 완료된 신청은 자동으로 표시됩니다.|Elige un día de buff arriba. Selecciona todos los intervalos de 30 minutos que te sirvan y pulsa Solicitar. Los registros completados se marcan automáticamente.|Escolha um dia de buff no topo. Selecione todos os intervalos de 30 minutos disponíveis e prima Candidatar. As inscrições concluídas são assinaladas automaticamente.|Choisissez un jour de buff en haut. Sélectionnez tous les créneaux de 30 minutes qui vous conviennent, puis appuyez sur Demander. Les inscriptions terminées sont marquées automatiquement.|اختر يوم التعزيز في الأعلى. حدد كل فترة 30 دقيقة تناسبك فعلًا ثم اضغط تقديم. تُعلّم التسجيلات المكتملة تلقائيًا.
Could not load King's Buff schedule|킹스 버프 일정을 불러올 수 없습니다|No se pudo cargar el horario de King's Buff|Não foi possível carregar o horário de King's Buff|Impossible de charger le planning de King's Buff|تعذر تحميل جدول تعزيزات الملك
Could not load your King's Buff registrations.|킹스 버프 신청 내역을 불러올 수 없습니다.|No se pudieron cargar tus registros de King's Buff.|Não foi possível carregar as suas inscrições de King's Buff.|Impossible de charger vos inscriptions aux King's Buff.|تعذر تحميل تسجيلات تعزيزات الملك الخاصة بك.
Profile found in State {state}. King's Buff bookings are only available to State 169 players.|{state} 왕국에서 프로필을 찾았습니다. 킹스 버프 예약은 169 왕국 플레이어만 가능합니다.|Perfil encontrado en el Estado {state}. Solo los jugadores del Estado 169 pueden reservar King's Buffs.|Perfil encontrado no Estado {state}. Só jogadores do Estado 169 podem reservar King's Buffs.|Profil trouvé dans l’État {state}. Les réservations de King's Buff sont réservées aux joueurs de l’État 169.|تم العثور على الملف في الولاية {state}. حجوزات تعزيزات الملك متاحة فقط للاعبي الولاية 169.
Profile found, but this Player ID could not be verified as a State 169 player.|프로필을 찾았지만 이 플레이어 ID가 169 왕국 소속인지 확인할 수 없습니다.|Se encontró el perfil, pero no se pudo verificar que este ID pertenezca al Estado 169.|O perfil foi encontrado, mas não foi possível confirmar que este ID pertence ao Estado 169.|Profil trouvé, mais cet identifiant n’a pas pu être vérifié comme joueur de l’État 169.|تم العثور على الملف، لكن تعذر التحقق من أن معرّف اللاعب يتبع الولاية 169.
Prep Day {day} · {date} · Kingshot / UTC|Prep {day}일차 · {date} · Kingshot / UTC|Día Prep {day} · {date} · Kingshot / UTC|Dia Prep {day} · {date} · Kingshot / UTC|Jour Prep {day} · {date} · Kingshot / UTC|يوم Prep {day} · {date} · Kingshot / UTC
Status: {status}|상태: {status}|Estado: {status}|Estado: {status}|Statut : {status}|الحالة: {status}
No availability returned|가능 시간이 반환되지 않았습니다|No se recibió disponibilidad|Não foi recebida disponibilidade|Aucune disponibilité reçue|لم تُرجع أوقات متاحة
Your existing registration remains unchanged until you save.|저장할 때까지 기존 신청은 변경되지 않습니다.|Tu registro actual no cambiará hasta que guardes.|A sua inscrição atual não muda até guardar.|Votre inscription actuelle reste inchangée jusqu’à l’enregistrement.|يبقى تسجيلك الحالي دون تغيير حتى تحفظ.
After you submit, this tab will show as completed.|제출 후 이 탭은 완료로 표시됩니다.|Tras enviar, esta pestaña aparecerá completada.|Após enviar, este separador aparecerá como concluído.|Après l’envoi, cet onglet apparaîtra comme terminé.|بعد الإرسال ستظهر علامة التبويب كمكتملة.
Could not submit availability|가능 시간을 제출할 수 없습니다|No se pudo enviar la disponibilidad|Não foi possível enviar a disponibilidade|Impossible d’envoyer les disponibilités|تعذر إرسال الأوقات المتاحة
✓ {buff} availability updated.|✓ {buff} 가능 시간이 업데이트되었습니다.|✓ Disponibilidad de {buff} actualizada.|✓ Disponibilidade de {buff} atualizada.|✓ Disponibilités pour {buff} mises à jour.|✓ تم تحديث الأوقات المتاحة لـ {buff}.
✓ {buff} registration submitted.|✓ {buff} 신청이 제출되었습니다.|✓ Registro de {buff} enviado.|✓ Inscrição de {buff} enviada.|✓ Inscription à {buff} envoyée.|✓ تم إرسال التسجيل لـ {buff}.
✓ All King's Buff registrations are complete. You can return here later to see your assigned times.|✓ 모든 킹스 버프 신청이 완료되었습니다. 나중에 돌아와 배정된 시간을 확인할 수 있습니다.|✓ Todos los registros de King's Buff están completos. Vuelve más tarde para consultar tus horarios asignados.|✓ Todas as inscrições de King's Buff estão concluídas. Volte mais tarde para consultar os horários atribuídos.|✓ Toutes les inscriptions aux King's Buff sont terminées. Revenez plus tard pour consulter vos horaires attribués.|✓ اكتملت جميع تسجيلات تعزيزات الملك. يمكنك العودة لاحقًا لمعرفة أوقاتك المحددة.
Booking code could not be verified.|예약 코드를 확인할 수 없습니다.|No se pudo verificar el código de reserva.|Não foi possível verificar o código de reserva.|Impossible de vérifier le code de réservation.|تعذر التحقق من رمز الحجز.
✓ Your existing King's Buff registrations have been loaded.|✓ 기존 킹스 버프 신청 내역을 불러왔습니다.|✓ Se han cargado tus registros de King's Buff.|✓ As suas inscrições de King's Buff foram carregadas.|✓ Vos inscriptions aux King's Buff ont été chargées.|✓ تم تحميل تسجيلات تعزيزات الملك الحالية.
✓ Booking code verified. Choose your first buff above.|✓ 예약 코드가 확인되었습니다. 위에서 첫 번째 버프를 선택하세요.|✓ Código verificado. Elige tu primer buff arriba.|✓ Código verificado. Escolha o primeiro buff acima.|✓ Code vérifié. Choisissez votre premier buff ci-dessus.|✓ تم التحقق من رمز الحجز. اختر تعزيزك الأول في الأعلى.
Current KVK Prep|현재 KVK Prep|KVK Prep actual|KVK Prep atual|KVK Prep actuel|KVK Prep الحالي
Please check this box to continue.|계속하려면 이 항목에 체크하세요.|Marca esta casilla para continuar.|Marque esta caixa para continuar.|Cochez cette case pour continuer.|حدد هذا المربع للمتابعة.
Please complete this field.|이 항목을 입력하세요.|Completa este campo.|Preencha este campo.|Remplissez ce champ.|أكمل هذا الحقل.
Please enter a valid value.|올바른 값을 입력하세요.|Introduce un valor válido.|Introduza um valor válido.|Saisissez une valeur valide.|أدخل قيمة صالحة.
Please use the requested format.|요청된 형식을 사용하세요.|Usa el formato solicitado.|Use o formato pedido.|Respectez le format demandé.|استخدم التنسيق المطلوب.
Use at least {count} characters.|최소 {count}자를 입력하세요.|Usa al menos {count} caracteres.|Use pelo menos {count} caracteres.|Utilisez au moins {count} caractères.|استخدم {count} من الأحرف على الأقل.
Use no more than {count} characters.|{count}자 이하로 입력하세요.|Usa como máximo {count} caracteres.|Use no máximo {count} caracteres.|Utilisez au maximum {count} caractères.|استخدم {count} من الأحرف كحد أقصى.
Enter a value of at least {value}.|{value} 이상의 값을 입력하세요.|Introduce un valor mínimo de {value}.|Introduza um valor mínimo de {value}.|Saisissez une valeur d’au moins {value}.|أدخل قيمة لا تقل عن {value}.
Enter a value no greater than {value}.|{value} 이하의 값을 입력하세요.|Introduce un valor máximo de {value}.|Introduza um valor máximo de {value}.|Saisissez une valeur ne dépassant pas {value}.|أدخل قيمة لا تزيد على {value}.
Built by {author}|제작: {author}|Creado por {author}|Criado por {author}|Créé par {author}|إعداد {author}
Transfer to State 169|169 왕국으로 이전|Transferencia al Estado 169|Transferência para o Estado 169|Transfert vers l’État 169|الانتقال إلى الولاية 169
Unknown|알 수 없음|Desconocido|Desconhecido|Inconnu|غير معروف
Player {id}|플레이어 {id}|Jugador {id}|Jogador {id}|Joueur {id}|اللاعب {id}
State {state}|왕국 {state}|Estado {state}|Estado {state}|État {state}|الولاية {state}
No alliance returned|연맹 정보가 반환되지 않았습니다|No se recibió una alianza|Não foi recebida uma aliança|Aucune alliance reçue|لم تُرجع معلومات تحالف
Power {power}|전투력 {power}|Poder {power}|Poder {power}|Puissance {power}|القوة {power}
Town Center {level}|도시 센터 {level}|Centro urbano {level}|Centro urbano {level}|Centre-ville {level}|مركز المدينة {level}
Player ID {id}|플레이어 ID {id}|ID de jugador {id}|ID de jogador {id}|Identifiant joueur {id}|معرّف اللاعب {id}
Thanks {name}. Your transfer application has been submitted to State 169 leadership.|{name}님, 감사합니다. 이전 신청서가 169 왕국 지도부에 제출되었습니다.|Gracias, {name}. Tu solicitud de transferencia se ha enviado a los líderes del Estado 169.|Obrigado, {name}. A sua candidatura de transferência foi enviada à liderança do Estado 169.|Merci {name}. Votre demande de transfert a été envoyée aux dirigeants de l’État 169.|شكرًا {name}. تم إرسال طلب انتقالك إلى قيادة الولاية 169.
Player lookup failed|플레이어 조회에 실패했습니다|La búsqueda del jugador falló|A consulta do jogador falhou|La recherche du joueur a échoué|فشل البحث عن اللاعب
Application submission failed|신청서 제출에 실패했습니다|No se pudo enviar la solicitud|Não foi possível enviar a candidatura|L’envoi de la demande a échoué|تعذر إرسال الطلب
Application submission failed.|신청서 제출에 실패했습니다.|No se pudo enviar la solicitud.|Não foi possível enviar a candidatura.|L’envoi de la demande a échoué.|تعذر إرسال الطلب.
An unexpected error occurred.|예기치 않은 오류가 발생했습니다.|Se produjo un error inesperado.|Ocorreu um erro inesperado.|Une erreur inattendue est survenue.|حدث خطأ غير متوقع.
Add your Supabase publishable key to this file first.|먼저 이 파일에 Supabase 공개 키를 추가하세요.|Añade primero tu clave publicable de Supabase a este archivo.|Adicione primeiro a chave publicável de Supabase a este ficheiro.|Ajoutez d’abord votre clé publiable Supabase à ce fichier.|أضف مفتاح Supabase القابل للنشر إلى هذا الملف أولًا.
`;
for(const row of extraRows.trim().split('\n')){const [key,...values]=row.split('|');if(values.length!==5)throw new Error('Invalid translation row: '+key);Object.keys(result).forEach((language,i)=>result[language][key]=values[i])}
for(const row of rows.trim().split('\n')){const [key,...values]=row.split('|');if(values.length!==5)throw new Error('Invalid translation row: '+key);Object.keys(result).forEach((language,i)=>result[language][key]=values[i])}
Object.assign(result.pt,{
"King's Buffs":"Bónus do Rei",
"Calculate launch delays and run a silent visual timer so multiple rallies land together.":"Calcule os atrasos de partida e use um temporizador visual silencioso para que vários rallies cheguem juntos.",
"Apply to transfer into State 169 with one clean, consistent application form.":"Candidate-se à transferência para o Estado 169 com um formulário simples e consistente.",
"Register for KVK King's Buff appointments and keep requests organised in one place.":"Inscreva-se nas marcações dos Bónus do Rei da KVK e mantenha os pedidos organizados num só lugar.",
"Compare State 169 with another kingdom using current kingdom strength and activity data.":"Compare o Estado 169 com outro reino usando dados atuais de força e atividade.",
"Verify your State 169 Player ID and redeem current Kingshot gift codes.":"Verifique o seu ID de jogador do Estado 169 e resgate os códigos-presente atuais de Kingshot."
});
Object.assign(result.ar,{
"King's Buffs":"تعزيزات الملك",
"Calculate launch delays and run a silent visual timer so multiple rallies land together.":"احسب تأخيرات الانطلاق وشغّل مؤقتًا مرئيًا صامتًا لتصل تجمعات متعددة معًا.",
"Apply to transfer into State 169 with one clean, consistent application form.":"قدّم طلب انتقال إلى الولاية 169 باستخدام نموذج واضح وموحد.",
"Register for KVK King's Buff appointments and keep requests organised in one place.":"سجّل لمواعيد تعزيزات الملك في KVK ونظّم الطلبات في مكان واحد.",
"Compare State 169 with another kingdom using current kingdom strength and activity data.":"قارن الولاية 169 بمملكة أخرى باستخدام بيانات القوة والنشاط الحالية.",
"Verify your State 169 Player ID and redeem current Kingshot gift codes.":"تحقق من معرّف لاعب الولاية 169 واسترد رموز هدايا كينغشوت الحالية."
});
for(const labels of Object.values(result))for(const status of ['Submitted','Reviewing','Approved','Waitlisted','Declined','Requested','Scheduled','Booked','Completed','Cancelled','Assigned'])labels[status.toLowerCase()]=labels[status];
for(const labels of Object.values(result))for(const [alias,key]of Object.entries({'New password':'New Password','Confirm password':'Confirm Password','SAVING…':'Saving…','SUBMITTING…':'Submitting…','current buff':"King's Buffs",'need action':'Needs Action','finished':'Completed','scheduled/booked':'Scheduled'}))if(labels[key])labels[alias]=labels[key];
const adminRows=`
Set Password|비밀번호 설정|Establecer contraseña|Definir palavra-passe|Définir le mot de passe|تعيين كلمة المرور
169 KS Tools|169 킹스샷 도구|Herramientas KS 169|Ferramentas KS 169|Outils KS 169|أدوات KS 169
The password service returned an invalid response (HTTP {status}).|비밀번호 서비스가 잘못된 응답을 반환했습니다 (HTTP {status}).|El servicio de contraseñas devolvió una respuesta no válida (HTTP {status}).|O serviço de palavras-passe devolveu uma resposta inválida (HTTP {status}).|Le service de mots de passe a renvoyé une réponse non valide (HTTP {status}).|أعادت خدمة كلمات المرور استجابة غير صالحة (HTTP {status}).
Password update failed (HTTP {status}).|비밀번호 변경 실패 (HTTP {status}).|No se pudo actualizar la contraseña (HTTP {status}).|Falha ao atualizar a palavra-passe (HTTP {status}).|Échec de la modification du mot de passe (HTTP {status}).|تعذّر تحديث كلمة المرور (HTTP {status}).
Password could not be changed. Please try again.|비밀번호를 변경하지 못했습니다. 다시 시도하세요.|No se pudo cambiar la contraseña. Inténtalo de nuevo.|Não foi possível alterar a palavra-passe. Tente novamente.|Impossible de modifier le mot de passe. Réessayez.|تعذّر تغيير كلمة المرور. يرجى المحاولة مجددًا.
Could not load audit log|감사 로그를 불러오지 못했습니다|No se pudo cargar el registro de auditoría|Não foi possível carregar o registo de auditoria|Impossible de charger le journal d’audit|تعذّر تحميل سجل التدقيق
Admin access denied|관리자 접근이 거부되었습니다|Acceso de administrador denegado|Acesso de administrador negado|Accès administrateur refusé|تم رفض وصول المسؤول
Request failed|요청 실패|La solicitud falló|O pedido falhou|Échec de la requête|فشل الطلب
{name} · Player ID {id}|{name} · 플레이어 ID {id}|{name} · ID de jugador {id}|{name} · ID de jogador {id}|{name} · ID de joueur {id}|{name} · معرّف اللاعب {id}
{name} · Player ID {id} · [{alliance}] · State 169|{name} · 플레이어 ID {id} · [{alliance}] · 스테이트 169|{name} · ID de jugador {id} · [{alliance}] · Estado 169|{name} · ID de jogador {id} · [{alliance}] · Estado 169|{name} · ID de joueur {id} · [{alliance}] · État 169|{name} · معرّف اللاعب {id} · [{alliance}] · الولاية 169
{name} · Player ID {id} · State 169|{name} · 플레이어 ID {id} · 스테이트 169|{name} · ID de jugador {id} · Estado 169|{name} · ID de jogador {id} · Estado 169|{name} · ID de joueur {id} · État 169|{name} · معرّف اللاعب {id} · الولاية 169
{name} · [{alliance}] · State 169|{name} · [{alliance}] · 스테이트 169|{name} · [{alliance}] · Estado 169|{name} · [{alliance}] · Estado 169|{name} · [{alliance}] · État 169|{name} · [{alliance}] · الولاية 169
{name} · State 169|{name} · 스테이트 169|{name} · Estado 169|{name} · Estado 169|{name} · État 169|{name} · الولاية 169
Review applicants, update statuses and manage the transfer list.|신청자를 검토하고 상태를 업데이트하며 이전 목록을 관리하세요.|Revisa solicitantes, actualiza estados y gestiona la lista de transferencias.|Reveja candidatos, atualize estados e gira a lista de transferências.|Examinez les candidatures, actualisez les statuts et gérez la liste des transferts.|راجع المتقدمين وحدّث الحالات وأدِر قائمة الانتقال.
OPEN TRANSFERS|이전 열기|ABRIR TRANSFERENCIAS|ABRIR TRANSFERÊNCIAS|OUVRIR LES TRANSFERTS|فتح الانتقالات
Search players, gear, coordinates and rankings across Kingshot.|킹스샷의 플레이어, 장비, 좌표 및 순위를 검색하세요.|Busca jugadores, equipo, coordenadas y clasificaciones de Kingshot.|Pesquise jogadores, equipamento, coordenadas e classificações de Kingshot.|Recherchez des joueurs, équipements, coordonnées et classements dans Kingshot.|ابحث عن اللاعبين والمعدات والإحداثيات والتصنيفات في كينغشوت.
SEARCH PLAYERS|플레이어 검색|BUSCAR JUGADORES|PESQUISAR JOGADORES|RECHERCHER DES JOUEURS|البحث عن لاعبين
Assign and manage KVK Prep King's Buff appointments.|KVK 준비 국왕 버프 일정을 배정하고 관리하세요.|Asigna y gestiona citas de beneficios del rey para la preparación de KVK.|Atribua e gira as marcações de bónus do rei na preparação da KVK.|Attribuez et gérez les créneaux de bonus du roi pour la préparation KVK.|عيّن مواعيد تعزيزات الملك لتحضير KVK وأدِرها.
OPEN BOOKINGS|예약 열기|ABRIR RESERVAS|ABRIR RESERVAS|OUVRIR LES RÉSERVATIONS|فتح الحجوزات
Create admins and assign Player Search, MoJ and Transfer permissions.|관리자를 만들고 플레이어 검색, MoJ 및 이전 권한을 부여하세요.|Crea administradores y asigna permisos de búsqueda de jugadores, MoJ y transferencias.|Crie administradores e atribua permissões de pesquisa de jogadores, MoJ e transferências.|Créez des administrateurs et attribuez les autorisations de recherche de joueurs, MoJ et transfert.|أنشئ مسؤولين وامنح صلاحيات البحث عن اللاعبين وMoJ والانتقال.
MANAGE ADMINS|관리자 관리|GESTIONAR ADMINISTRADORES|GERIR ADMINISTRADORES|GÉRER LES ADMINISTRATEURS|إدارة المسؤولين
Audit Log|감사 로그|Registro de auditoría|Registo de auditoria|Journal d’audit|سجل التدقيق
Review recent booking, transfer, player-search and admin account actions.|최근 예약, 이전, 플레이어 검색 및 관리자 계정 작업을 검토하세요.|Revisa acciones recientes de reservas, transferencias, búsquedas de jugadores y cuentas de administrador.|Reveja ações recentes de reservas, transferências, pesquisas de jogadores e contas de administrador.|Consultez les actions récentes de réservation, transfert, recherche de joueurs et gestion des comptes administrateurs.|راجع إجراءات الحجز والانتقال والبحث عن اللاعبين وحسابات المسؤولين الأخيرة.
VIEW AUDIT LOG|감사 로그 보기|VER REGISTRO DE AUDITORÍA|VER REGISTO DE AUDITORIA|VOIR LE JOURNAL D’AUDIT|عرض سجل التدقيق
See how often State 169 tools are being used without exposing player identities.|플레이어 신원을 공개하지 않고 스테이트 169 도구의 사용 빈도를 확인하세요.|Consulta la frecuencia de uso de las herramientas del Estado 169 sin revelar la identidad de los jugadores.|Veja a frequência de utilização das ferramentas do Estado 169 sem expor a identidade dos jogadores.|Consultez la fréquence d’utilisation des outils de l’État 169 sans révéler l’identité des joueurs.|اطّلع على معدل استخدام أدوات الولاية 169 دون كشف هويات اللاعبين.
VIEW USAGE|사용량 보기|VER USO|VER UTILIZAÇÃO|VOIR L’UTILISATION|عرض الاستخدام
Current code:|현재 코드:|Código actual:|Código atual:|Code actuel :|الرمز الحالي:
KVK Prep|KVK 준비|Preparación de KVK|Preparação da KVK|Préparation KVK|تحضير KVK
No alliance|연맹 없음|Sin alianza|Sem aliança|Sans alliance|لا يوجد تحالف
Assigned {time} UTC · Player availability|배정 시간 {time} UTC · 플레이어 가능 시간|Asignado a las {time} UTC · Disponibilidad del jugador|Atribuído às {time} UTC · Disponibilidade do jogador|Attribué à {time} UTC · Disponibilités du joueur|تم التعيين في {time} UTC · أوقات توفر اللاعب
Player availability|플레이어 가능 시간|Disponibilidad del jugador|Disponibilidade do jogador|Disponibilités du joueur|أوقات توفر اللاعب
Already assigned to another player|이미 다른 플레이어에게 배정됨|Ya asignado a otro jugador|Já atribuído a outro jogador|Déjà attribué à un autre joueur|معيّن للاعب آخر بالفعل
Assign {time} UTC|{time} UTC 배정|Asignar {time} UTC|Atribuir {time} UTC|Attribuer {time} UTC|تعيين {time} UTC
Remove {time}|{time} 제거|Eliminar {time}|Remover {time}|Retirer {time}|إزالة {time}
Copied Player ID {id}.|플레이어 ID {id} 복사 완료.|ID de jugador {id} copiado.|ID de jogador {id} copiado.|ID de joueur {id} copié.|تم نسخ معرّف اللاعب {id}.
Player ID: {id}|플레이어 ID: {id}|ID de jugador: {id}|ID de jogador: {id}|ID de joueur : {id}|معرّف اللاعب: {id}
{time} UTC · {name} [{alliance}] · ID {id}|{time} UTC · {name} [{alliance}] · ID {id}|{time} UTC · {name} [{alliance}] · ID {id}|{time} UTC · {name} [{alliance}] · ID {id}|{time} UTC · {name} [{alliance}] · ID {id}|{time} UTC · {name} [{alliance}] · المعرّف {id}
{time} UTC · {name} · ID {id}|{time} UTC · {name} · ID {id}|{time} UTC · {name} · ID {id}|{time} UTC · {name} · ID {id}|{time} UTC · {name} · ID {id}|{time} UTC · {name} · المعرّف {id}
No appointments assigned|배정된 일정 없음|No hay citas asignadas|Sem marcações atribuídas|Aucun créneau attribué|لا توجد مواعيد معيّنة
Could not load Prep booking security.|준비 예약 보안 정보를 불러오지 못했습니다.|No se pudo cargar la seguridad de reservas de preparación.|Não foi possível carregar a segurança das reservas de preparação.|Impossible de charger la sécurité des réservations de préparation.|تعذّر تحميل إعدادات أمان حجوزات التحضير.
Booking code: SET ✓|예약 코드: 설정됨 ✓|Código de reserva: CONFIGURADO ✓|Código de reserva: DEFINIDO ✓|Code de réservation : DÉFINI ✓|رمز الحجز: معيّن ✓
Booking code: NOT SET|예약 코드: 미설정|Código de reserva: NO CONFIGURADO|Código de reserva: NÃO DEFINIDO|Code de réservation : NON DÉFINI|رمز الحجز: غير معيّن
Could not set Prep booking code.|준비 예약 코드를 설정하지 못했습니다.|No se pudo configurar el código de reserva de preparación.|Não foi possível definir o código de reserva de preparação.|Impossible de définir le code de réservation de préparation.|تعذّر تعيين رمز حجز التحضير.
Prep booking code updated.|준비 예약 코드가 업데이트되었습니다.|Código de reserva de preparación actualizado.|Código de reserva de preparação atualizado.|Code de réservation de préparation actualisé.|تم تحديث رمز حجز التحضير.
Could not clear Prep booking code.|준비 예약 코드를 지우지 못했습니다.|No se pudo borrar el código de reserva de preparación.|Não foi possível limpar o código de reserva de preparação.|Impossible d’effacer le code de réservation de préparation.|تعذّر مسح رمز حجز التحضير.
Prep booking code cleared.|준비 예약 코드가 지워졌습니다.|Código de reserva de preparación borrado.|Código de reserva de preparação limpo.|Code de réservation de préparation effacé.|تم مسح رمز حجز التحضير.
{status} · {time} · by {name}|{status} · {time} · 담당자 {name}|{status} · {time} · por {name}|{status} · {time} · por {name}|{status} · {time} · par {name}|{status} · {time} · بواسطة {name}
{status} · {time}|{status} · {time}|{status} · {time}|{status} · {time}|{status} · {time}|{status} · {time}
{status} · by {name}|{status} · 담당자 {name}|{status} · por {name}|{status} · por {name}|{status} · par {name}|{status} · بواسطة {name}
Yes|예|Sí|Sim|Oui|نعم
No|아니요|No|Não|Non|لا
Player search failed|플레이어 검색 실패|La búsqueda de jugadores falló|A pesquisa de jogadores falhou|Échec de la recherche de joueurs|فشل البحث عن اللاعبين
This player is hiding their governor gear.|이 플레이어는 영주 장비를 숨기고 있습니다.|Este jugador oculta su equipo de gobernador.|Este jogador está a ocultar o equipamento de governador.|Ce joueur masque son équipement de gouverneur.|هذا اللاعب يخفي معدات الحاكم.
Gear|장비|Equipo|Equipamento|Équipement|المعدات
Hero|영웅|Héroe|Herói|Héros|البطل
Lv {level} · Stars {stars} · {power}|레벨 {level} · 별 {stars} · {power}|Niv. {level} · Estrellas {stars} · {power}|Nív. {level} · Estrelas {stars} · {power}|Niv. {level} · Étoiles {stars} · {power}|المستوى {level} · النجوم {stars} · {power}
Quality {quality}|품질 {quality}|Calidad {quality}|Qualidade {quality}|Qualité {quality}|الجودة {quality}
Exclusive {level}|전용 {level}|Exclusivo {level}|Exclusivo {level}|Exclusif {level}|حصري {level}
Hero gear|영웅 장비|Equipo de héroe|Equipamento de herói|Équipement de héros|معدات البطل
Enhance {enhancement} · Refine {refine}|강화 {enhancement} · 정련 {refine}|Mejora {enhancement} · Refinamiento {refine}|Melhoria {enhancement} · Refinamento {refine}|Amélioration {enhancement} · Raffinement {refine}|التعزيز {enhancement} · الصقل {refine}
Ranking|순위|Clasificación|Classificação|Classement|التصنيف
Reference {reference}|참조 {reference}|Referencia {reference}|Referência {reference}|Référence {reference}|المرجع {reference}
this player|이 플레이어|este jugador|este jogador|ce joueur|هذا اللاعب
Application for {name} deleted.|{name}의 신청이 삭제되었습니다.|Solicitud de {name} eliminada.|Candidatura de {name} eliminada.|Demande de {name} supprimée.|تم حذف طلب {name}.
Transfers|이전|Transferencias|Transferências|Transferts|الانتقالات
Manage Admins|관리자 관리|Gestionar administradores|Gerir administradores|Gérer les administrateurs|إدارة المسؤولين
Login: Player ID {id}|로그인: 플레이어 ID {id}|Inicio de sesión: ID de jugador {id}|Início de sessão: ID de jogador {id}|Connexion : ID de joueur {id}|تسجيل الدخول: معرّف اللاعب {id}
Legacy login: {email}|기존 로그인: {email}|Inicio de sesión antiguo: {email}|Início de sessão antigo: {email}|Ancienne connexion : {email}|تسجيل الدخول القديم: {email}
email account|이메일 계정|cuenta de correo|conta de email|compte e-mail|حساب بريد إلكتروني
Player ID {id} · [{alliance}] · {status}|플레이어 ID {id} · [{alliance}] · {status}|ID de jugador {id} · [{alliance}] · {status}|ID de jogador {id} · [{alliance}] · {status}|ID de joueur {id} · [{alliance}] · {status}|معرّف اللاعب {id} · [{alliance}] · {status}
Player ID {id} · {status}|플레이어 ID {id} · {status}|ID de jugador {id} · {status}|ID de jogador {id} · {status}|ID de joueur {id} · {status}|معرّف اللاعب {id} · {status}
Not linked|연결되지 않음|Sin vincular|Não associado|Non lié|غير مرتبط
Disabled|비활성|Desactivado|Desativado|Désactivé|معطّل
Buffs|버프|Beneficios|Bónus|Bonus|التعزيزات
Admins|관리자|Administradores|Administradores|Administrateurs|المسؤولون
Login converted.|로그인이 전환되었습니다.|Inicio de sesión convertido.|Início de sessão convertido.|Connexion convertie.|تم تحويل تسجيل الدخول.
Created {name} · login ID {id} · State 169 verified.|{name} 생성됨 · 로그인 ID {id} · 스테이트 169 인증 완료.|Creado: {name} · ID de acceso {id} · Estado 169 verificado.|Criado: {name} · ID de acesso {id} · Estado 169 verificado.|Créé : {name} · ID de connexion {id} · État 169 vérifié.|تم إنشاء {name} · معرّف الدخول {id} · تم التحقق من الولاية 169.
Could not load usage analytics|사용량 분석을 불러오지 못했습니다|No se pudieron cargar las estadísticas de uso|Não foi possível carregar as estatísticas de utilização|Impossible de charger les statistiques d’utilisation|تعذّر تحميل تحليلات الاستخدام
current buff|현재 버프|beneficio actual|bónus atual|bonus actuel|التعزيز الحالي
`;
for(const row of adminRows.trim().split('\n')){const [key,...values]=row.split('|');if(values.length!==5)throw new Error('Invalid translation row: '+key);['ko','es','pt','fr','ar'].forEach((language,i)=>result[language][key]=values[i])}
// These templates contain only caller-owned data, symbols or the explicit UTC label.
for(const language of ['ko','es','pt','fr','ar'])for(const key of ['{name}','{time}','{status}','{troop} {gear}','{date} · KINGSHOT UTC','+{delay} {name}','VS','—'])result[language][key]=key;
result.en={};
const countRows=[
 ['days','day','일','día','días','dia','dias','jour','jours','يوم','أيام'],
 ['items','item','개','elemento','elementos','item','itens','élément','éléments','عنصر','عناصر'],
 ['heroes','hero','명의 영웅','héroe','héroes','herói','heróis','héros','héros','بطل','أبطال'],
 ['ranks','rank','개 순위','clasificación','clasificaciones','classificação','classificações','classement','classements','تصنيف','تصنيفات'],
 ['recent events','recent event','개의 최근 이벤트','evento reciente','eventos recientes','evento recente','eventos recentes','événement récent','événements récents','حدث حديث','أحداث حديثة']
];
for(const [plural,singular,ko,es1,esN,pt1,ptN,fr1,frN,ar1,arN] of countRows){const key='{count} '+plural;result.en[key]={one:'{count} '+singular,other:key};result.ko[key]='{count}'+ko;result.es[key]={one:'{count} '+es1,other:'{count} '+esN};result.pt[key]={one:'{count} '+pt1,other:'{count} '+ptN};result.fr[key]={one:'{count} '+fr1,other:'{count} '+frN};result.ar[key]={zero:'{count} '+ar1,one:'{count} '+ar1,two:'{count} '+ar1,few:'{count} '+arN,many:'{count} '+ar1,other:'{count} '+ar1}}
['ko','es','pt','fr','ar'].forEach((language,i)=>result[language]['{count} waiting']=['대기: {count}','En espera: {count}','Em espera: {count}','En attente : {count}','بانتظار المعالجة: {count}'][i]);
// Count labels avoid awkward agreement for Arabic dual and zero forms.
['days','items','heroes','ranks','recent events'].forEach((key,i)=>result.ar['{count} '+key]=['عدد الأيام: {count}','عدد العناصر: {count}','عدد الأبطال: {count}','عدد التصنيفات: {count}','عدد الأحداث الحديثة: {count}'][i]);
result.en['{count} times selected']={one:'{count} time selected',other:'{count} times selected'};
result.en['{done} of {total} buff registrations completed']={plural:'total',one:'{done} of {total} buff registration completed',other:'{done} of {total} buff registrations completed'};
['ko','es','pt','fr','ar'].forEach((language,i)=>result[language]['{done} of {total} buff registrations completed']=['버프 신청 완료: {done}/{total}','Registros completados: {done}/{total}','Registos concluídos: {done}/{total}','Inscriptions terminées : {done}/{total}','تسجيلات التعزيز المكتملة: {done}/{total}'][i]);
for(const key of ['Use at least {count} characters.','Use no more than {count} characters.']){
  result.en[key]={one:key.replace('characters','character'),other:key};
  for(const language of ['es','pt','fr']){const other=result[language][key];result[language][key]={one:other.replace('caracteres','carácter').replace('caractères','caractère'),other}}
}
window.KSTranslations=result;
window.dispatchEvent(new Event('ks-translations-ready'));
})();
