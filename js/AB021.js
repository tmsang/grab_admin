const AB021 = (function(){
    function loadNotification(notificationId,callback){
        //apiをお呼び
        API.GET(URL_NOTIFICATIONINFODISPLAY
            + "?settingFlg=1"
            + "&notificationId=" + notificationId
          , function(data) {
            //0:正常、 1:異常、 -1：データなし
            if (data.result == 0) {
                callback(data.details);
            }
            //error　ログイン認証失敗
            else if (data.result == -1) {
                // showMessagError("AA001_001");
            }
            else {
                // showMessagError("004");
            }
        });
    }

    function update(updateData){
        var value = {
            "settingFlg": 1,
            "details": []
        };

        value.details.push(updateData);

        API.PUT(URL_NOTIFICATIONINFOVERIFICATION
          , value, function(data){
            //0:正常、 1:異常、 -1：データなし
            if (data.result == 0) {
                //Show message success
            }
            //error　ログイン認証失敗
            else if (data.result == -1) {
                //Show message error
            }
            else {
                //COMMON.showMessageById("004");
            }
        });
    }

    return {
        loadNotification: loadNotification,
        update: update,
    };
    
})();

const AB021_GUI = (function(){

    var updateData = {};

    function init() {
        const queryString = getQueryString();

        const did = queryString["did"];
        const nid = queryString["nid"];

        const decodeDid = typeof did === "undefined" ? "" : atob(did);
        const decodeNid = typeof nid === "undefined" ? "" : atob(nid);

        loadData(decodeDid, decodeNid);
    }

    function loadData(destinationId, notificationId) {
        //Load data for [利用者ID] datalist
        AB021.loadNotification(notificationId, function(result) {
            //Exサンプルデータ反映
            //base-info display-none
            //基本情報表示
            if($('.base-info').hasClass('display-none')){
                $('.base-info').removeClass('display-none');
            }

            $(".headerNotificationIdLbl").html(result[0].notificationId);
            $(".headerPatientIdLbl").html(result[0].patientId);
            $(".headerPatientNmKanjiLbl").html(result[0].patientNmKanji);
            $(".headerPatientAgeLbl").html(result[0].patientAge);
            $(".headerPatientGenderLbl").html(result[0].patientGender);
            $(".headerHospitalizationNmLbl").html(result[0].ospitalizationNm);
            $(".headerDepartmentNmLbl").html(result[0].departmentNm);

            //検体検査(1)の場合
            if(parseInt(result[0].targetSystemKbn) === 1){
                if($('.sample-test').hasClass('display-none')){
                    $('.sample-test').removeClass('display-none');

                    $(".detail1ExaminationDtLbl").html(result[0].sampleTestDetails[0].examinationDt);
                    $(".detail1ResultDtLbl").html(result[0].sampleTestDetails[0].resultDt);
                    $(".detail1SpecimenNmLbl").html(result[0].sampleTestDetails[0].specimenNm);
                    $(".detail1ExaminationNmLbl").html(result[0].sampleTestDetails[0].examinationNm);
                    $(".detail1ResultValueLbl").html(result[0].sampleTestDetails[0].resultValue);
                    $(".detail1UnitLbl").html(result[0].sampleTestDetails[0].unit);
                    $(".detail1LowValueLbl").html(result[0].sampleTestDetails[0].lowValue);
                    $(".detail1UpperValueLbl").html(result[0].sampleTestDetails[0].upperValue);
                    $(".detail1JudgeLbl").html(result[0].sampleTestDetails[0].judge);
                }
                $('.bacterial-test').addClass('display-none');
            } 

            //抗酸菌検査(2, 3)の場合
            if(parseInt(result[0].targetSystemKbn) === 2 || parseInt(result[0].targetSystemKbn) === 3){
                if($('.bacterial-test').hasClass('display-none')){
                    $('.bacterial-test').removeClass('display-none');

                    $(".detail2TargetSystemNmLbl").html(result[0].targetSystemNm);
                    $(".detail2BacteriologicalKbnNmLbl").html(result[0].microbiologicalTestDetails[0].bacteriologicalKbnNm);
                    $(".detail2CollectDtLbl").html(result[0].microbiologicalTestDetails[0].collectDt);
                    $(".detail2ResultDtLbl").html(result[0].microbiologicalTestDetails[0].resultDt);
                    $(".detail2SpecimenNmLbl").html(result[0].microbiologicalTestDetails[0].specimenNm);
                    $(".detail2SmearNmLbl").html(result[0].microbiologicalTestDetails[0].smearNm);
                    $(".detail2VirusNmLbl").html(result[0].microbiologicalTestDetails[0].virusNm);
                    $(".detail2QuantityNmLbl").html(result[0].microbiologicalTestDetails[0].quantityNm);
                    $(".detail2ResultNmLbl").html(result[0].microbiologicalTestDetails[0].resultValue);
                    $(".detail2CommentLbl").html(result[0].microbiologicalTestDetails[0].comment);
                }
                $('.sample-test').addClass('display-none');
            }

            updateData = {
                hospitalCd: "00",
                notificationId: parseInt(notificationId),
                destinationId: parseInt(destinationId),
                verificationFlg: 2
            }

            AB021.update(updateData);
        });
    }

    return {
        init: init,
    };
    
})();

AB021_GUI.init();
