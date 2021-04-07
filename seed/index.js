$('.currency').on('change', function() {
    this.value=this.value.replace(/,/g, "");
    if(isNaN(parseInt(this.value))) {this.value = '';} else {this.value = cop(parseInt(this.value));}
});
$('.number').on('change', function() {
    if(isNaN(parseInt(this.value))) {this.value = '';} else {this.value = parseInt(this.value);}
});
$('.decimal2').on('change', function() {
    if(isNaN(parseFloat(this.value))) {this.value = '';} else {this.value = parseFloat(this.value).toFixed(2);}
});
$('.decimal4').on('change', function() {
    if(isNaN(parseFloat(this.value))) {this.value = '';} else {this.value = parseFloat(this.value).toFixed(4);}
});

function cop(valor) {
  return valor.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
var app = angular.module('myApp', []);
app.controller('formCtrl', function($scope) {
    $scope.cuotas = [];
    $scope.totalpagado = 0;
    $scope.totalcapital = 0;
    $scope.totalintereses = 0;
    $scope.reset = function() {
        $scope.datos = {};
        $scope.cuotas = {};
        //$scope.datos = {"monto":"90,000,000", "plazo": 180, "interes": 10.36, "uvr": 215.7496, "inflacion": 6.40};
    };
    $scope.calcular = function() {
        $scope.cuotas = [];
        $scope.totalpagado = 0;
        $scope.totalintereses = 0;
        var plazo = $scope.datos.plazo;
        var monto = $scope.datos.monto.replace(/,/g, "")*1;
        var interes = 0;
        var tipo = $('#tipointeres').val();
        switch(tipo){
          case "TEA":
            interes = ((1 + ($scope.datos.interes/100))**(1/12) - 1);
          break;
          case "TNA":
            interes = $scope.datos.interes/12/100;
          break;
          case "MV":
            interes = $scope.datos.interes/100;
          break;
        }
        var valorcuota = (interes*(1+interes)**plazo)*monto/(((1+interes)**plazo)-1);
        var totalpagado = 0;
        var totalintereses = 0;
        var totalcapital = 0;
        $scope.datos.valorcuota = cop(Math.round(valorcuota));
        // UVR
        var valoruvr=0, montouvr=0, valorcuotauvr=0, inflacionmensual=0;
        if($scope.datos.chkuvr == true){
          valoruvr = $scope.datos.uvr;
          montouvr = monto / valoruvr;     
          valorcuotauvr = (interes*(1+interes)**plazo)*montouvr/(((1+interes)**plazo)-1);
          inflacionmensual = ((1 + ($scope.datos.inflacion/100))**(1/12) - 1)
        }
        var meses = [];
        var amortizacion = [];
        var intereses = [];
        for (i = 1; i <= $scope.datos.plazo; i++) {
            var valorinteres = monto*interes;
            var valorcapital = valorcuota-valorinteres;
            var saldo = monto-valorcapital;
            monto = monto - valorcapital;
            // UVR
            var valorinteresuvr=0, valorcapitaluvr=0, saldouvr=0;
            if($scope.datos.chkuvr == true){
              valoruvr = valoruvr * (1+inflacionmensual);
              valorinteresuvr = montouvr*interes;
              valorcapitaluvr = valorcuotauvr-valorinteresuvr;
              saldouvr = montouvr-valorcapitaluvr;
              montouvr = montouvr - valorcapitaluvr;
              valorinteres = valorinteresuvr*valoruvr;
              valorcapital = valorcapitaluvr*valoruvr;
              saldo = saldouvr*valoruvr;
              valorcuota = valorcuotauvr*valoruvr;
            }
            $scope.cuotas.push({"numerocuota":i, "valorcuota": cop(Math.round(valorcuota)), "valorinteres": cop(Math.round(valorinteres)), "valorcapital": cop(Math.round(valorcapital)), "saldo":cop(Math.round(saldo))});
            totalpagado = totalpagado + valorcuota;
            totalintereses = totalintereses + valorinteres;
            totalcapital = totalcapital + valorcapital;
            meses.push(i);
            amortizacion.push(Math.round(saldo));
            intereses.push(Math.round(valorinteres));
        }
        $scope.datos.totalcapital = cop(Math.round(totalcapital));
        $scope.datos.totalpagado = cop(Math.round(totalpagado));
        $scope.datos.totalintereses = cop(Math.round(totalintereses));
        chartpie(Math.round(totalcapital), Math.round(totalintereses));
        chartarea(meses,amortizacion,intereses);
    };
    $scope.reset();
});

function chartpie(capital, intereses){
  var ctx = document.getElementById("myPieChart");
  var myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Capital", "Intereses"],
      datasets: [{
        data: [capital, intereses],
        backgroundColor: ['rgb(0, 255, 0)', 'rgb(0, 0, 255)'],
        hoverBackgroundColor: ['rgb(0, 255, 0)', 'rgb(0, 0, 255)'],
        hoverBorderColor: ['rgb(0, 255, 0)', 'rgb(0, 0, 255)'],
      }],
    },
    options: {
      responsive: true,
				title: {
					display: true,
					text: 'Capital e Intereses'
		  },
      maintainAspectRatio: false,
      legend: {
        display: true,
        onClick: (e) => e.stopPropagation()
      },
      cutoutPercentage: 80,
      tooltips: {
					callbacks: {
                label: function(tooltipItem, data) {
                    var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || 'Other';
                    var label = data.labels[tooltipItem.index];
                    console.log(tooltipItem);
                    console.log(data);
                    return label + ': ' + cop(value);
                }
            }
				},
    },
  });
}

function chartarea(meses,amortizacion,intereses){
  var ctx = document.getElementById("myAreaChart");
  ctx.height = '240';
  var myLineChart = new Chart(ctx, {
    type: 'line',
			data: {
				labels: meses,
				datasets: [{
					label: 'Saldo Capital',
					backgroundColor: "rgb(0,255,0)",
					borderColor: "rgb(0,255,0)",
					data: amortizacion,
					fill: false,
				}, {
					label: 'Intereses',
					fill: false,
					backgroundColor: "rgb(0,0,255)",
					borderColor: "rgb(0,0,255)",
					data: intereses,
				}]
			},
      legend: {
        display: true,
        onClick: (e) => e.stopPropagation()
      },
			options: {
				responsive: true,
				title: {
					display: true,
					text: 'Amortización'
				},
				tooltips: {
					callbacks: {
                label: function(tooltipItem, data) {
                    var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || 'Other';
                    var label = data.labels[tooltipItem.index];
                    var value = tooltipItem.yLabel;
                    return datasetLabel + ': ' + cop(value);
                }
            }
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Cuota (#)'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: false,
							labelString: 'Valor ($)'
						},
            ticks: {
                        callback: function (value) {
                            return cop(value);
                        }
            }
					}]
				}
			}
  });
}

$(document).ready(function() {
	
    document.addEventListener("deviceready", onDeviceReady, false);

});

function onDeviceReady() {
    // ADMOB 
    initAdmob();
}