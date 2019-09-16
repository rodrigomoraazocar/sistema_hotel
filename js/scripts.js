$(document).ready(function(){
	ListarDados();
	$("#pagina").val(1);
			
	$('#inputDataHoraEntrada').mask('99/99/9999 99:99');
	$('#inputDataHoraSaida').mask('99/99/9999 99:99');
	$('#inputDocumento').mask('999999999');
	$('#inputTelefone').mask('99999-9999');
});

function SalvarPessoa() {
	if( $('#inputNome').val() == "" ){
		alert("Nome não informado");
		$('#inputNome').focus();
		return false;
	}
	if( $('#inputDocumento').val() == "" ){
		alert("Documento não informado");
		$('#inputDocumento').focus();
		return false;
	}
	if( $('#inputTelefone').val() == "" ){
		alert("Telefone não informado");
		$('#inputTelefone').focus();
		return false;
	}

	var dados = {"nome" : $('#inputNome').val(), "documento" : $('#inputDocumento').val(), "telefone" : $('#inputTelefone').val()};
		
	postRequest('http://localhost:3000/objPessoa', dados)
	  .then(data => console.log(data)) 
	  .catch(error => console.error(error))
		
} 

function ConsultarPessoa() {
	if( $('#inputDataHoraEntrada').val() == "" ){
		alert("Data Entrada não informada");
		$('#inputDataHoraEntrada').focus();
		return false;
	}
	if( $('#inputPessoa').val() == "" ){
		alert("Pessoa não informada");
		$('#inputPessoa').focus();
		return false;
	}
	
	//var url = 'http://localhost:3000/objPessoa?nome=' + $('#inputPessoa').val();
	var url = new URL('http://localhost:3000/objPessoa');
	
	var params = {nome: $('#inputPessoa').val()};
	url.search = new URLSearchParams(params);
			
	fetch(url)
		.then(response => response.json())
		.then(data => {			
			var pessoa = data;
			FazerCheckin(pessoa);
		}) 
		.catch(error => error => console.error(error))
	
}
	
function FazerCheckin(pessoa) {
		
	if( $('#gridCheck').prop("checked") == true ){
		var check = true;
	}
	else{
		var check = false;
	}
		
	var dateTime = $("#inputDataHoraEntrada").val();
	var dateTime = dateTime.split(" ");	
	var date = dateTime[0].split("/");
	var time = dateTime[1].split(":");	
	var dataEntrada = date[2] + '-' + date[1] + '-' + date[0] + 'T' + time[0] + ':' + time[1] + ':00';
	
	var dateTime = $("#inputDataHoraSaida").val();
	if( dateTime == '' ){
		var dataSaida = '';
	}
	else{	
		var dateTime = dateTime.split(" ");	
		var date = dateTime[0].split("/");
		var time = dateTime[1].split(":");	
		var dataSaida = date[2] + '-' + date[1] + '-' + date[0] + 'T' + time[0] + ':' + time[1] + ':00';
	}
			
	var dados = {"dataEntrada" : dataEntrada, "dataSaida" : dataSaida, "adicionalVeiculo" : check, "pessoaId" : pessoa[0].id};
		
	postRequest('http://localhost:3000/checkin', dados)
	  .then(data => console.log(data)) 
	  .catch(error => console.error(error))
		
} 

function postRequest(url, dados) {
	return fetch(url, {
		credentials: 'same-origin', 
		method: 'POST', 
		body: JSON.stringify(dados), 
		headers: new Headers({
		  'Content-Type': 'application/json'
		}),
	})
	.then(response => response.json())
}

function ListarDados() {	
	fetch('http://localhost:3000/objPessoa')
		.then(response => response.json())
		.then(data => {
			var listagemPessoas = data;		
			MontarListagem(listagemPessoas);
		})
		.catch(error => console.error(error))			
} 

function getRequest(url, dados) {
	return fetch(url, {
		credentials: 'same-origin', 
		method: 'GET', 
		params: dados, 
		headers: new Headers({'Content-Type': 'application/json'})
	})
	.then(response => response.json())
	
}

function Proximo() {	
	pagina = parseInt($("#pagina").val(),10) + 1;	
	//var url = 'http://localhost:3000/objPessoa/?_page=' + pagina + '&_limit=3';
	var url = new URL('http://localhost:3000/objPessoa');
	
	var params = {'_page': pagina, '_limit': '3'};
	url.search = new URLSearchParams(params);
			
	fetch(url)
		.then(response => response.json())
		.then(data => {			
			$("#pagina").val(pagina);			
			var listagemPessoas = data;
			$("#listagem").empty();			
			MontarListagem(listagemPessoas);
		}) 
		.catch(error => console.error(error))
			
} 

function Anterior() {
	if( parseInt($("#pagina").val(),10) == 1 ){
		pagina = 1;
	}
	else{	
		pagina = parseInt($("#pagina").val(),10) - 1;
	}
	//var url = 'http://localhost:3000/objPessoa/?_page=' + pagina + '&_limit=3';
	var url = new URL('http://localhost:3000/objPessoa');
	
	var params = {'_page': pagina, '_limit': '3'};
	url.search = new URLSearchParams(params);
			
	fetch(url)
		.then(response => response.json())
		.then(data => {			
			$("#pagina").val(pagina);			
			var listagemPessoas = data;
			$("#listagem").empty();			
			MontarListagem(listagemPessoas);
		}) 
		.catch(error => console.error(error))
	
} 

function MontarListagem(jsonObj) {
	
	var pessoas = jsonObj;
//alert(pessoas.length);

	/*var dataAtual = new Date();	
	var dia = dataAtual.getDate();
	//var dia_sem = dataAtual.getDay();
	var mes = dataAtual.getMonth();
	var ano = dataAtual.getFullYear();*/
  
	for (var i = 0; i < pessoas.length; i++) {	
		var tr = $(document.createElement('tr'));
		var td = document.createElement('td');
		td.textContent = pessoas[i].nome;		
		tr.append(td);		
		var td = document.createElement('td');		
		td.textContent = pessoas[i].documento;
		tr.append(td);
		var td = document.createElement('td');
		//td.textContent = valorGasto;
		tr.append(td);
			
		$("#listagem").append(tr);
	}
}
