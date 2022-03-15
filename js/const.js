
/*********************************************************************
 *固定パラメータ設定
 *********************************************************************/
//API情報
const API_HOST = 'https://172.25.129.73:44331';
const URL_LOGIN = API_HOST + "/api/admin/login";

//AA011
const URL_PATIENTPROFILE = API_HOST + "/ALERT/REST/PatientProfile";
const URL_ITEMMST = API_HOST + "/ALERT/REST/ItemMst";
const URL_NOTIFICATIONINFODISPLAY = API_HOST + "/ALERT/REST/NotificationInfo/Display";
const URL_NOTIFICATIONINFO = API_HOST + "/ALERT/REST/NotificationInfo";


//AA091
const URL_USERMST                 = API_HOST + "/ALERT/REST/UserMst";
const URL_DESTINATIONMSTDISPLAY   = API_HOST + "/ALERT/REST/DestinationMst/Display";
const URL_DESTINATIONMST          = API_HOST + "/ALERT/REST/DestinationMst";

//AA092
const URL_DEPARTMENTMST           = API_HOST + "/ALERT/REST/DepartmentMst";
const URL_TERMMSTDISPLAY          = API_HOST + "/ALERT/REST/TermsMst/Display";
const URL_TERMMST                 = API_HOST + "/ALERT/REST/TermsMst";
const URL_EXAMINATIONMST          = API_HOST + "/ALERT/REST/ExaminationMst";
const URL_VIRUSMST                = API_HOST + "/ALERT/REST/VirusMst";
const URL_SPECIMENMST             = API_HOST + "/ALERT/REST/SpecimenMst";

//AB021
const URL_NOTIFICATIONINFOVERIFICATION = API_HOST + "/ALERT/REST/NotificationInfo/Verification";

const GMAA001 = "AA001";//ログイン
const GMAA011 = "AA011";//通知管理
const GMAA021 = "AA021";//AA021";//検査結果一覧
const GMAA091 = "AA091";//通知メンテンナンス
const GMAA092 = "AA092";//通知条件メンテナンス
const GMAB021 = "AB021";//通知条件メンテナンス
const GM002 = "GM002";//検査アラート(SP)
const SESSION_KEY = "user";
const SESSION_TIME_KEY = "sessionTime";

//
const DATE_FORMAT = "YYYY-MM-DD";
const DATE_DEFAULT_BEGIN = "1900-01-01";
const DATE_DEFAULT_END = "2999-12-31";
const TARGETSYSTEMKBN_SPECIMEN = "1"
const TARGETSYSTEMKBN_GENERAL  = "2"
const TARGETSYSTEMKBN_ACID     = "3"
//key
const KEY_CODE_ENTER = 13;
const KEY_CODE_ESC   = 27;
const KEY_CODE_TAB   = 9;