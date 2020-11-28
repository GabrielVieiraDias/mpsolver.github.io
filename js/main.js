/* main.js loads at end of mathprog.html */

console.log('Loading main.js');
$(document).ready(newModel);

// Global Variables
var fileSep = "/";
var exampleDir = "./examples";
var fileId = [];
var fileCount = 0;
var ds = [];
var fileEntry = null;
var isNew = true;

var glpColKind = [];
glpColKind[GLP_CV] = 'Real';
glpColKind[GLP_IV] = 'Integer';
glpColKind[GLP_BV] = 'Binary';

var glpColStatus = [];
glpColStatus[GLP_BS] = 'Basic';
glpColStatus[GLP_NL] = 'LoBnd';
glpColStatus[GLP_NU] = 'UpBnd';
glpColStatus[GLP_NF] = 'Free';
glpColStatus[GLP_NS] = 'Fixed';

var glpRowStatus = [];
glpRowStatus[GLP_BS] = 'Basic';
glpRowStatus[GLP_NL] = 'LoBnd';
glpRowStatus[GLP_NU] = 'UpBnd';
glpRowStatus[GLP_NF] = 'Free';
glpRowStatus[GLP_NS] = 'Fixed';

var glpStatus = [];
glpStatus[GLP_OPT]    = "A solução é ótima.";
glpStatus[GLP_FEAS]   = "A solução é viável.";
glpStatus[GLP_INFEAS] = "A solução é inviável.";
glpStatus[GLP_NOFEAS] = "O problema não tem solução viável.";
glpStatus[GLP_UNBND]  = "O problema tem solução ilimitada.";
glpStatus[GLP_UNDEF]  = "A solução é indefinida.";

// global glpk data structure
var lp = glp_create_prob();
glp_set_print_func(printLog);

// modal callback function
var modalCallback = function() {};

// variable to save name of file
var saveAnchor = document.getElementById('saveAnchor');

console.log('Initialize edit pane.');

// attach CodeMirror to the textarea 'editor'
var modelEditor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  lineNumbers: true,
  lineWrapping: true,
  mode: 'mathprog'
});
modelEditor.markClean();

// make modelEditor CodeMirror instance resizable
$(modelEditor.getWrapperElement()).resizable({
  resize: function() {
    modelEditor.setSize($(this).width(), $(this).height());
    modelEditor.refresh();
  }
});

// other initializations
$('#modalAbout').modal({show:false});
$('#modalConfirmClearAll').modal({show:false});

$('#btnModalConfirmClearAll').click(function () {
  if(!modelEditor.isClean())
    {
      if(isNew){
        document.getElementById('modelFileName').value = "";
        modelEditor.setValue('');
        newModel();
      }else{
        document.getElementById('inputOpenModel').click();
        document.getElementById('modelFileName').value = "";
        modelEditor.setValue('');
      }      
    }
    
});

$('#menuNew').click(newModel);
$('#menuOpen').click(openModel);
$('#menuSave').click(saveModel);

$(".example").click(function() {
  openExample(exampleDir + fileSep + this.id + ".mod");
});

$('#menuAbout').click(function () {
    $('#modalAbout').modal({show:true});
});

$('#btnNewModel').tooltip();
$('#btnOpenModel').tooltip();
$('#btnSaveModel').tooltip();
$('#btnSolveModel').tooltip();

$(document).ready(function() {
  $('#btnSolveModel').click(function(){
      $('#loading-bar-spinner').css('display','block');
  });
});

$('#btnNewModel').click( function() {
  isNew = true;
  if(!modelEditor.isClean())
    {
      if(isNew){
        document.getElementById('modelFileName').value = "";
        //modelEditor.setValue('');
        newModel();
      }    
    }else{ newModel(); }

});
$('#btnOpenModel').click( function() {
  if(modelEditor.isClean()){
    document.getElementById('inputOpenModel').click();
   openModel();
  }else{
    isNew = false;
    openModel();
  }

this.blur();
});
$('#btnSaveModel').click( function() {
  saveModel();
  this.blur();
});
$('#btnSolveModel').click( function() {

  solveModel();
  this.blur();

  var elementos = modelEditor.getValue();
  var result = "";

  var out = elementos.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,'')

  console.log('teste', out);
});

/**********************************************************************
 load example files
**********************************************************************/

var md = markdownit();
var fileEntry = null;
var fileName = '';

/* regex pattern to match an initial multiline comment */
var re = /\s*\/\*+((.|[\r\n])*?)\*+\//;

/**
 * Resets state for start a new MathProg model
 */
function newModel() {
  if (modelEditor.isClean()) {
    fileEntry = null;
    fileName = document.getElementById('modelFileName');
    $('#instructionContent').html('&nbsp;');
    $('#modelFileName').html(fileName);    
    modelEditor.setValue('');
    modelEditor.markClean();
    clearOutput();
  } else {
    $('#btnModalConfirmClearAll').click(function() {
      modelEditor.markClean();
      newModel();
    });
    $('#modalConfirmClearAll').modal({show: true});
  }
}


function copiarExemplo(id){

    if(id == 'helloWorld'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#helloWorld').text().trim()); 
      document.getElementById('modelFileName').value = "OlaMundo";
    }else if(id == 'lpTwoVars'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#lpTwoVars').text().trim());
      document.getElementById('modelFileName').value = "DuasVariaveis";
    }else if(id == 'linearEqns'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#linearEqns').text().trim());
      document.getElementById('modelFileName').value = "EquLineares";
    }else if(id == 'sets'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#sets').text().trim());
      document.getElementById('modelFileName').value = "Conjuntos";
    }else if(id == 'parameters'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#parameters').text().trim());
      document.getElementById('modelFileName').value = "Parametros";
    }else if(id == 'chartTools'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#chartTools').text().trim());
      document.getElementById('modelFileName').value = "GraficosGoogle";
    }else if(id == 'ProjectCPM'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#projectCPM').text().trim());
      document.getElementById('modelFileName').value = "ProjetoCPM";
    }else if(id == 'jobShop'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#jobShop').text().trim());
      document.getElementById('modelFileName').value = "EscalaLoja";
    }else if(id == 'Jesuit'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#Jesuit').text().trim());
      document.getElementById('modelFileName').value = "Jesuitas";
    }else if(id == 'transportationNetwork'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#transportationNetwork').text().trim());
      document.getElementById('modelFileName').value = "RedeTransporte";
    }else if(id == 'StockCutting'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#stockCutting').text().trim());
      document.getElementById('modelFileName').value = "ReduçãoEstoque";
    }else if(id == 'tableSeating'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#tableSeating').text().trim());
      document.getElementById('modelFileName').value = "LugaresMesa";
    }else if(id == 'vrp'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#vrp').text().trim());
      document.getElementById('modelFileName').value = "RoteamentoVeiculo";
    }else if(id == 'tsptw'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#tsptw').text().trim());
      document.getElementById('modelFileName').value = "CaixeiroViajante";
    }else if(id == 'vrptw'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#vrptw').text().trim());
      document.getElementById('modelFileName').value = "TempoRotaVeiculo";
    }else if(id == 'theNewsvendorProblem'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#theNewsvendorProblem').text().trim());
      document.getElementById('modelFileName').value = "ProblemaVendedor";
    }else if(id == 'BPMACO'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#BPMACO').text().trim());
      document.getElementById('modelFileName').value = "OpcaoCompraAmerica";
    }else if(id == 'BPMAPO'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#BPMAPO').text().trim());
      document.getElementById('modelFileName').value = "OpcaoVendaAmerica";
    }else if(id == 'BPMECO'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#BPMECO').text().trim());
      document.getElementById('modelFileName').value = "OpcaoCompraEuropeia";
    }else if(id == 'BPMEPO'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#BPMEPO').text().trim());
      document.getElementById('modelFileName').value = "OpcaoVendaEuropeia";
    }else if(id == 'PoliticalArb'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#PoliticalArb').text().trim());
      document.getElementById('modelFileName').value = "MercadosPoliticos";
    }else if(id == 'RiskNeutral'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#RiskNeutral').text().trim());
      document.getElementById('modelFileName').value = "RiscoNeutroAI";
    }else if(id == 'retirement'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#retirement').text().trim());
      document.getElementById('modelFileName').value = "PoupançaAposentadoria";
    }else if(id == 'Normal'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#normal').text().trim());
      document.getElementById('modelFileName').value = "DistribuicaoNormalMulti";
    }else if(id == 'piecewise'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#piecewise').text().trim());
      document.getElementById('modelFileName').value = "InterpolacaoLinearPorPartes";
    }else if(id == 'Sorting'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#Sorting').text().trim());
      document.getElementById('modelFileName').value = "Ordenação";
    }else if(id == 'DataReconciliation'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#DataReconciliation').text().trim());
      document.getElementById('modelFileName').value = "ReconciliacaoDados";
    }else if(id == 'solvay'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#solvay').text().trim());
      document.getElementById('modelFileName').value = "GeracaoConsumo";
    }else if(id == 'MAD'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#MAD').text().trim());
      document.getElementById('modelFileName').value = "OtimizacaoPortifolioMAD";
    }else if(id == 'PlantExpansion'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#PlantExpansion').text().trim());
      document.getElementById('modelFileName').value = "ExpansaoFabrica";
    }else if(id == 'Gambling'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#Gambling').text().trim());
      document.getElementById('modelFileName').value = "SDPJogadorNeutro";
    }else if(id == 'RNGambling'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#RNGambling').text().trim());
      document.getElementById('modelFileName').value = "SDPJogadorNeutro";
    }else if(id == 'RAGambling'){
      document.getElementById('modelFileName').value = "";
      modelEditor.setValue($('#RAGambling').text().trim());
      document.getElementById('modelFileName').value = "SDPJogadorAverso";
    }
    
    
    
  
}


function populateName(){
  document.getElementById('modelFileName').value = document.getElementsByName('inputOpenModel[]')[0].files[0].name;
}

  
/**
 * Open a model from the external file system
 */
function openModel () { 
  
  if (modelEditor.isClean()) {    
  function lerArquivoTxt(evt){
    var texto = "";
    var files = evt.target.files;
    for (var i = 0, f; f = files[i]; i++){
        var reader = new FileReader();
        reader.onload = function(event){
            var conteudo = event.target.result;
            var linhas = conteudo.split('\n');
            for(x=0;x<linhas.length;x++){
               
               texto += linhas[x];
               texto += '\n';
            }
            modelEditor.setValue(texto);
        };
        reader.readAsText(f);
    }
}
  document.getElementById('inputOpenModel').addEventListener('change', lerArquivoTxt, false);

  setTimeout(function(){ populateName(); }, 4000);
  } else {
    $('#btnModalConfirmClearAll').click(function() {   
      modelEditor.markClean();
      openModel();
    });
    $('#modalConfirmClearAll').modal({show: true});
  }

}

/**
 * Save model to external filesystem
 */
function saveModel() {
      var text = modelEditor.getValue();
      var fileName = document.getElementById('modelFileName').value;
      var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    if(fileName == null || fileName == "" || fileName.trim() == ""){
      alert('Favor preencher o nome do arquivo!!');
    } else {
      saveAs(blob, fileName.trim()+".mod"); 
    }   
} 



function saveModelAs() {
  save();
}

function save () {
  fileEntry.createWriter(
    function(fileWriter) {
      fileWriter.onerror = errorHandler;
      fileWriter.onwrite = function(e) {
        fileWriter.onwrite = function(e) {
          displayInfo('Saved: ' + fileEntry.name);
          $('#modelFileName').html(fileName);
          var str = re.exec(modelEditor.getValue());
          if (str !== null) {
            $('#instructionContent').html(md.render(str[1]));
            renderMathInElement(document.getElementById("instructionContent"));
          } else {
            $('#instructionContent').html('&nbsp;');
          }
          modelEditor.markClean();
        };
        var blob = new Blob([modelEditor.getValue()],
          {type: 'text/plain'});
        fileWriter.write(blob);
      };
      fileWriter.truncate(0);
    },
    errorHandler
  );
}

/**********************************************************************
 utility functions
**********************************************************************/

/**
 * round number to a specified significant digits
 */
function formatNumber(num,sig){
  if (isNaN(parseFloat(num)) || !isFinite(num)) {return num;}
  if (Math.abs(num) <= Number.MIN_VALUE) {return '0';}
  if (num >= Number.MAX_VALUE/10) {return '+Inf';}
  if (num <= -Number.MAX_VALUE/10) {return '-Inf';}
  if (arguments.length < 2) {sig = 5;}
  if (num.toPrecision(sig) == num) {return num.toString();}
  return num.toPrecision(sig).toString();
}

/**
 * Handle errors from fileSystem calls
 */
function errorHandler(e) {
  console.dir(e);
  var msg;
  if (e.target && e.target.error)
    e = e.target.error;
  if (e.message)
    msg = e.message;
  else if (e.name)
    msg = e.name;
  else if (e.code)
    msg = "Code " + e.code;
  else
    msg = e.toString();
  displayInfo('Error: ' + msg);
}

/**********************************************************************
 variables pane
**********************************************************************/

function writeVariableTable() {	
	$("#variableTableDiv").empty();
	
	s = "<th>Name</th>";
	s = s + "<th>Kind</th>";
	s = s + "<th>Status</th>";
	s = s + "<th>LoBnd</th>";
	s = s + "<th>UpBnd</th>";
	s = s + "<th>Sensitivity</th>";
	s = s + "<th>Solution</th>";
	$("#variableTableDiv").append("<thead><tr>" + s + "</tr></thead>");
	
    var soln = 0;
	$("#variableTableDiv").append("<tbody>");
    for (var i = 1; i <= glp_get_num_cols(lp); i++) {
        soln = isMIP()?glp_mip_col_val(lp,i):glp_get_col_prim(lp,i);
		s = "<td>" + glp_get_col_name(lp,i) + "</td>";
		s = s + "<td>" + glpColKind[glp_get_col_kind(lp,i)] + "</td>";
		s = s + "<td>" + glpColStatus[glp_get_col_stat(lp,i)] + "</td>";
		s = s + "<td>" + formatNumber(glp_get_col_lb(lp,i)) + "</td>";		
		s = s + "<td>" + formatNumber(glp_get_col_ub(lp,i)) + "</td>";		
		s = s + "<td>" + formatNumber(glp_get_col_dual(lp,i)) + "</td>";		
		s = s + "<td>" + formatNumber(soln) + "</td>";
        $("#variableTableDiv").append("<tr>" + s + "</tr>");
	}
	$("#variableTableDiv").append("</tbody>");
}

/**********************************************************************
 constraints pane
**********************************************************************/

function writeConstraintTable() {
	$("#constraintTableDiv").empty();
	
	s = "<th>Name</th>";
	s = s + "<th>Status</th>";
	s = s + "<th>LB</th>";
	s = s + "<th>UB</th>";
	s = s + "<th>Sensitivity</th>";
	s = s + "<th>Solution</th>";
	$("#constraintTableDiv").append("<thead><tr>" + s + "</tr></thead>");
	
  var soln = 0;
	$("#constraintTableDiv").append("<tbody>");
  for (var i = 1; i <= glp_get_num_rows(lp); i++) {
    soln = isMIP()?glp_mip_row_val(lp,i):glp_get_row_prim(lp,i);
		s = "<td>" + glp_get_row_name(lp,i) + "</td>";
		s = s + "<td>" + glpRowStatus[glp_get_row_stat(lp,i)] + "</td>";
		s = s + "<td>" + formatNumber(glp_get_row_lb(lp,i)) + "</td>";		
		s = s + "<td>" + formatNumber(glp_get_row_ub(lp,i)) + "</td>";		
		s = s + "<td>" + formatNumber(glp_get_row_dual(lp,i)) + "</td>";		
		s = s + "<td>" + formatNumber(soln) + "</td>";
    $("#constraintTableDiv").append("<tr>" + s + "</tr>");
	}
	$("#constraintTableDiv").append("</tbody>");
}

/**********************************************************************
 functions to manage the display message
**********************************************************************/

var displayTimeoutID;

function displayInfo (value) {
  clearMessage();
  $('#message').addClass('alert-info').html(value).css('visibility','visible').show();
  if (displayTimeoutID) {
    clearTimeout(displayTimeoutID);
  }
  displayTimeoutID = setTimeout( function() {
    $('#message').removeClass('alert-info').html('&nbsp;').css('visibility','hidden').show();
    },
    3000
  );
}

function displaySuccess (value) {
  clearMessage();
  $('#message').addClass('alert-success').html(value).css('visibility','visible').show();
}

function displayWarning (value) {
  clearMessage();
  $('#message').addClass('alert-warning').html(value).css('visibility','visible').show();
}

function displayError (value) {
  clearMessage();
  $('#message').addClass('alert-error').html(value).css('visibility','visible').show();
}

function clearMessage() {
  $('#message').removeClass('alert-success');
  $('#message').removeClass('alert-warning');
  $('#message').removeClass('alert-error');
  $('#message').removeClass('alert-info');
  $('#message').html('&nbsp;');
 /*   $('#message').css('visibility','hidden'); */
}

/**********************************************************************
 manage dashboard pane
**********************************************************************/

function displayDashboard() {
  var nBV = glp_get_num_bin(lp);
  var nIV = glp_get_num_int(lp) - nBV;
  var nCV = glp_get_num_cols(lp) - nIV - nBV;
  var nVars = nCV + nIV + nBV;

  var nCols = glp_get_num_cols(lp);
  var nInt = glp_get_num_int(lp);
  var nBin = glp_get_num_bin(lp);
  var nRows = glp_get_num_rows(lp);
  var problemType =  glp_get_obj_name(lp)?'Optimization':'Feasibility';
  if (nVars === 0) {
    problemType = 'Empty';
  } else if (nBV + nIV === 0) {
    problemType = 'Linear ' + problemType;
  } else if (nCV + nIV === 0) {
    problemType = '0-1 ' + problemType;
  } else if (nCV === 0) {
    problemType = 'Integer ' + problemType;
  } else if (nIV === 0) {
    problemType = 'Mixed 0-1 ' + problemType;
  } else {
    problemType = 'Mixed Integer ' + problemType;
  }
  $('#dashboardProb').html(problemType);
  if (glp_get_obj_name(lp)) {
    $('#dashboardObj').html((glp_get_obj_dir(lp)==GLP_MIN?'Minimum ':'Maximum ') + glp_get_obj_name(lp));
  } else {
    $('#dashboardObj').html('null');
  }
  $('#dashboardObjVal').html(formatNumber(isMIP()?glp_mip_obj_val(lp):glp_get_obj_val(lp),8));
  $('#dashboardNcols').html(nVars);
  $('#dashboardNints').html(nIV);
  $('#dashboardNbins').html(nBV);
  $('#dashboardNvars').html(nCV);
  $('#dashboardNrows').html(nRows);
  $('#dashboardNnz').html(glp_get_num_nz(lp));
}

function clearDashboard (){
  $('.dashboardCell').html('');
}
$('.dashboardCell').css('text-align','right');

// open menu links w/ rel="external" in new windows to avoid losing edits
$('a[rel="external"]').click(function() {
  $(this).attr('target','_blank');
});


function clearOutput() {
  clearMessage();
  clearDashboard();
  $('#variableTableDiv').html('');
  $('#constraintTableDiv').html('');
  $('#outputTab').html('&nbsp;');
  $('#logContent').text('&nbsp;');
}

function clearData() {
  $('#dataTab').html('');
  fileId = [];
  fileCount = 0;
  ds = [];
}

// LP/LP+MIP radio buttons
function isMIP () {
  return (glp_get_num_int(lp) > 0);
}

/**********************************************************************
 MathProgError(message,arg)
 An error type used to catch attempts to read tables not in cache.
**********************************************************************/

function MathProgError(message,arg) {
  this.name = 'MathProgError';
  this.message = message || "MathProg Error";
  this.arg = arg || null;
  this.stack = (new Error()).stack;
}
MathProgError.prototype = new Error();

function tablecb(arg,mode,data) {
  switch(arg[1]) {
    case 'CSV':
      return tablecb_csv(arg,mode,data);
    case 'GCHART':
      return tablecb_chart(arg,mode,data);
    case 'JSON':
      return tablecb_json(arg,mode,data);
    default:
      throw new Error('Unrecognized table driver ' + arg[1]);
  }
}

function tablecb_chart(arg,mode,data) {
  switch(mode) {
    case 'R':
      throw new Error('Table GCHART is for OUT mode only.');

    case 'W':
      // display with Google Chart Tools.
      //    arg[1]  "GCHART"
      //    arg[2]   Header
      //    arg[3]   chartType (optional; default is a Table)
      //    arg[4]   options

      // add new div container for the display
      $('<div><h4>' + arg[2]+ '</h4></div>')
        .appendTo('#outputTab')
        .css('padding-bottom','50px');

      // insert child div to hold chart
      var div = document.getElementById('outputTab').lastChild;
      div.appendChild(document.createElement('div'));

      google.load('visualization', '1',{"callback" : drawVisualization});
      function drawVisualization() {
        var tableData = google.visualization.arrayToDataTable(data);
        var chartType = (arg.length > 3)?arg[3]:'Table';
        var options = {
          width: 750,
          hAxis: {title: tableData.getColumnLabel(0)}
        };
        if (arg.length > 4) {
          options = $.extend(options,eval('(' + arg[4] + ')'));
        }
        for (var j=0; j < tableData.getNumberOfColumns(); j++) {
          if (tableData.getColumnType(j)=='number') {
            for (var i=0; i < tableData.getNumberOfRows(); i++) {
              tableData.setFormattedValue(i,j,formatNumber(tableData.getValue(i,j)));
            }
          }
        }
        var chart = new google.visualization.ChartWrapper({
          chartType: chartType,
          containerId: div.lastChild,
          dataTable: tableData,
          options: options
        });
        chart.draw();
      }
      return null;

    default :
      throw new Error('Unrecognized table mode ' + mode);
  }
}

function tablecb_json(arg,mode,data) {
  switch(mode) {
    case 'R':
      if (!fileId[arg[2]]) {
        throw new MathProgError('JSON file ' + arg[2] + ' not loaded',arg);
      } else {
        var data = ds[arg[2]];
        var arr = [];
        var line = [];
        for (var j = 0; j < data.getNumberOfColumns(); j++) {
          line.push(data.getColumnLabel(j));
        }
        arr.push(line);
        for (var i = 0; i < data.getNumberOfRows(); i++) {
          line = [];
          for (var j = 0; j <  data.getNumberOfColumns(); j++) {
            line.push(data.getValue(i,j));
          }
          arr.push(line);
        }
        return arr;
      }
      break;

    case 'W':
      // display with Google Chart Tools.
      //    arg[1]  "JSON"
      //    arg[2]   Header
      //    arg[3]   chartType (optional; default is a Table)
      var chartType = (arg.length > 3)?arg[3]:'Table';

      // add new div container for the display
      $('<div></div>').appendTo('#outputTab').html('<h4>' + arg[2] + '</h4>').css('padding-bottom','30px');

      // insert child div to hold chart
      var div = document.getElementById('outputTab').lastChild;
      div.appendChild(document.createElement('div'));

      google.load('visualization', '1',{"callback" : drawVisualization});
      function drawVisualization() {
        var tableData = google.visualization.arrayToDataTable(data);
        for (var j=0; j < tableData.getNumberOfColumns(); j++) {
          if (tableData.getColumnType(j)=='number') {
            for (var i=0; i < tableData.getNumberOfRows(); i++) {
              tableData.setFormattedValue(i,j,formatNumber(tableData.getValue(i,j)));
            }
          }
        }
        var chart = new google.visualization.ChartWrapper({
          chartType: chartType,
          containerId: div.lastChild,
          dataTable: tableData,
          options: {
            width: 750,
            hAxis: {title: tableData.getColumnLabel(0)}
          }
        });
        chart.draw();
      }
      return null;

    default :
      throw new MathProgError('Unrecognized table mode ' + mode);
  }
}

function tablecb_csv(arg,mode,data) {
  switch(mode) {
    case 'R':
      if (!fileId[arg[2]]) {
        // throw MathProgError if file isn't loaded into data cache
        throw new MathProgError('CSV file ' + arg[2] + ' not loaded',arg);
      } else {
        // read from data cache
        var dataId = 'MathProgFile_' + fileId[arg[2]].toString();
        return $('#'+dataId).html();
      }
      break;

    case 'W':
      // write to a new div element
      document.getElementById('outputTab').appendChild(document.createElement('div'));
      var div = document.getElementById('outputTab').lastChild;
      $(div).html('<a><h4>' + arg[2] + '</h4></a>');
      $(div).click(function(){saveCSV(arg[2],data.toString());});
      div.style.paddingBottom = "20px";
      div.appendChild(document.createElement('pre'));
      var pre = div.lastChild;
      $(pre).append(data.toString());
      return null;

    default:
      throw new Error('Unrecognized table mode ' + mode);
  }
}

function saveCSV(filename,data) {
  filepicker.setKey('AIdU1Voz7RN686Gcu3kNEz');
  filepicker.store(
    data, 
    {
      filename: 'tmp.mod',
      mimetype: 'text/plain',
      location: 'S3'
    },
    // If store is successful then export file
    function(FPFileS3) {
      filepicker.exportFile(
        FPFileS3, 
        {
          mimetype: 'text/*',
          container: 'modal',
          services: ['COMPUTER','BOX','DROPBOX','GOOGLE_DRIVE'],
          suggestedFilename: filename
        },
        // If export succeeds
        function(FPFile) {
          filepicker.remove(FPFileS3);
        },
        // If export fails
        function(FPFile) {
          filepicker.remove(FPFileS3);
          console.log(FPError.toString());
        }
      );
    },
    function(FPError) {
      console.log(FPError.toString());
    }
  );
}

/**********************************************************************
 print callback functions for glpk/MathProg
**********************************************************************/

// GLPK log output
function printLog(value){
  $('#logContent').append(value + '\n');
}

// print MathProg output from printf
function printOutput(value,filename){
  filename = filename || 'Terminal_Output';
  if (!fileId[filename]) {
    fileId[filename] = ++fileCount;
  }
  var OutputId = 'MathProgFile_' + fileId[filename].toString();
  if (document.getElementById(OutputId) === null) {
    $('<h4>'+filename+'</h4>').appendTo('#outputTab');
    $('<pre id = ' + OutputId + '></pre>').appendTo('#outputTab').css('padding-bottom','0.8em');
    $('<br>').appendTo('#outputTab');
  }
  $('#' + OutputId).append(value + '\n');
}

/**********************************************************************
 Generic Table Driver - Based on JSON Driver
**********************************************************************/

function xerror(message) {
  throw new Error(message);
}

function xassert(outcome,message) {
  if (!outcome) {
    throw new Error(message);
  }
  return 0;
}

function GenericDriver(dca, mode, tablecb){
  this.mode = mode;
  this.fname = null;
  this.fname = mpl_tab_get_arg(dca, 2);
  var k;
  if (mode == 'R') {
    this.ref = {};
    if (tablecb) {
      this.data = tablecb(dca.arg, mode);
      if (typeof this.data == 'string') {
        this.data = JSON.parse(this.data);
      }
      this.cursor = 1;
    } else {
      xerror("json driver: unable to open " + this.fname);
    }
    for (var i = 0, meta = this.data[0]; i < meta.length; i++) {
      this.ref[meta[i]] = i;
    }
  } else if (mode == 'W') {
    this.tablecb = tablecb;
    var names = [];
    this.data = [names];
    var nf = mpl_tab_num_flds(dca);
    for (k = 1; k <= nf; k++) {
      names.push(mpl_tab_get_name(dca, k));
    }
  } else {
    xassert(mode != mode);
  }
}

GenericDriver.prototype["writeRecord"] = function(dca){
  var k;
  xassert(this.mode == 'W');
  var nf = mpl_tab_num_flds(dca);
  var line = [];
  for (k = 1; k <= nf; k++){
    switch (mpl_tab_get_type(dca, k)){
      case 'N':
        line.push(mpl_tab_get_num(dca, k));
        break;
      case 'S':
        line.push(mpl_tab_get_str(dca, k));
        break;
      default:
        xassert(dca != dca);
    }
  }
  this.data.push(line);
  return 0;
};

GenericDriver.prototype["readRecord"] = function(dca){
  /* read next record */
  var ret = 0;
  xassert(this.mode == 'R');

  /* read fields */
  var line = this.data[this.cursor++];
  if (line === null) return XEOF;

  for (var k = 1; k <= mpl_tab_num_flds(dca); k++){
    var index = this.ref[mpl_tab_get_name(dca, k)];
    if (index !== null){
      var value = line[index];
      switch (typeof value){
        case 'number':
          mpl_tab_set_num(dca, k, value);
          break;
        case 'boolean':
          mpl_tab_set_num(dca, k, Number(value));
          break;
        case 'string':
          mpl_tab_set_str(dca, k, value);
          break;
        default:
          xerror('Unexpected data type ' + value + " in " + this.fname);
      }
    }
  }
  return 0;
};

GenericDriver.prototype["flush"] = function(dca){
  // this.tablecb(dca.arg, this.mode, this.data);  <== why doesn't this work?
  // this.tablecb(dca.a, this.mode, this.data);
  var args = mpl_tab_get_args(dca);
  this.tablecb(args, this.mode, this.data);
};

mpl_tab_drv_register("GCHART", GenericDriver);
mpl_tab_drv_register("MY", GenericDriver);

/**********************************************************************
 Data Cache
**********************************************************************/

function loadCSV(filename) {
  var jqxhr = $.get(filename, function(data) {
    if (!fileId[filename]) {
      fileId[filename] = ++fileCount;
    }
    var dataId = 'MathProgFile_' + fileId[filename].toString();
    if (document.getElementById(dataId) === null) {
      $('<h4>' + filename + '</h4>').appendTo('#dataTab');
      $('<pre id=' + dataId + '></pre>')
        .appendTo('#dataTab')
        .css('padding-bottom','0.8em');
      $('<br>').appendTo('#dataTab');
    }
    $('#' + dataId).html(data);
  });
  return jqxhr;
}

function loadJSON(arg,callback) {
  var filename = arg[2];
  var key = arg[3];
  if (!fileId[filename]) {
    fileId[filename] = ++fileCount;
  }
  var dataId = 'MathProgFile_' + fileId[filename].toString();
  function drawVisualization() {
    var query = new google.visualization.Query(
      'https://docs.google.com/spreadsheet/tq?key=' + key + '&gid=0&headers=-1');
    query.send(handleQueryResponse);
  }
  function handleQueryResponse(response) {
    if (response.isError()) {
      throw new Error(response.getMessage() + ' ' + response.getDetailMessage());
    } else {
      if (document.getElementById(dataId) === null) {
        $('<h4>' + filename + '</h4>').appendTo('#dataTab');
        $('<div id=' + dataId + '></div>').appendTo('#dataTab').css('padding-bottom','2em');
      }
      var data = response.getDataTable();
      var table = new google.visualization.Table(document.getElementById(dataId));
      table.draw(data,null);
      ds[filename] = data;
      callback();
    }
  }
  google.load('visualization', '1',{packages:['table'],"callback" : drawVisualization});
}

/**********************************************************************
 Solver
**********************************************************************/

function solveModel() {
  try {
    solve();
  } catch (err) {
    if (err instanceof MathProgError) {
      // trap table reading errors
      if (err.arg !== null) {
        var arg = err.arg;
        switch (arg[1]) {
          case 'CSV':
            if (arg[3]===null) {
              var jqxhr = loadCSV(arg[2]);
              jqxhr.done(solve);
              jqxhr.fail(function(jqxhr, textStatus, errorThrown) {
                displayError('Table error: ' + arg[2] + ' ' + errorThrown);
              });
            } else {
              displayError('Unrecognized option for the CSV table driver.');
            }
            break;
          case 'JSON':
            loadJSON(arg,solve);
            break;
          default:
        }
      } else {
        displayError(err.message);
      }
    } else {
      displayError(err.message);
    }
    return null;
  }
}

function solve() {
  tic = Date.now();
  clearOutput();
  clearMessage();

  printLog('Reading ...');
  var tran = glp_mpl_alloc_wksp();
  try {
    glp_mpl_read_model_from_string(tran,'MathProg Model',modelEditor.getValue());
  } catch (err) {
      displayError(err.message);
      modelEditor.setCursor(err.line,0);
      modelEditor.scrollIntoView(null);
      return null;
  }

  printLog('\nGenerating ...');
  glp_mpl_generate(tran,null,printOutput,tablecb);

  printLog('\nBuilding ...');
  glp_mpl_build_prob(tran,lp);

  printLog('\nSolving ...');
  var smcp = new SMCP({presolve: GLP_ON});
  glp_simplex(lp, smcp);

  if (isMIP()) {
    printLog('\nInteger optimization ...');
    glp_intopt(lp);
  } 

  printLog('\nPost-Processing ...');
  if(lp) {
	  if (glp_get_status(lp)==GLP_OPT) {
      if (!isMIP() && (glp_get_num_int(lp) > 0)) {
        displayWarning('Linear relaxation of an MIP.');
      } else {
        displaySuccess(glpStatus[glp_get_status(lp)]);
      }
    } else if (glp_get_status(lp)==GLP_UNDEF) {
      displayWarning(glpStatus[glp_get_status(lp) + glp_get_status(lp) + GLP_UNDEF]);
    } else if (glp_get_status(lp)==GLP_NOFEAS) {
      displayWarning(glpStatus[glp_get_status(lp) + glp_get_status(lp) + GLP_NOFEAS]);
    } else if (glp_get_status(lp)==GLP_INFEAS) {
      displayWarning(glpStatus[glp_get_status(lp) + glp_get_status(lp) + GLP_INFEAS]);
    } else if (glp_get_status(lp)==GLP_FEAS) {
      displayWarning(glpStatus[glp_get_status(lp) + glp_get_status(lp) + GLP_FEAS]);
    } else if (glp_get_status(lp)==GLP_UNBND) {
      displayWarning(glpStatus[glp_get_status(lp) + glp_get_status(lp) + GLP_UNBND]);
    }
    glp_mpl_postsolve(tran,lp,isMIP()?GLP_MIP:GLP_SOL);
    displayDashboard();
	  writeVariableTable();
		writeConstraintTable();
  } else {
    throw new MathProgError((isMIP()?'MILP':'LP') + " failed. Consult GLPK Log.");
  }
  
  printLog('\nElapsed time: ' + (Date.now()-tic)/1000 + ' seconds');
  return null;
}
