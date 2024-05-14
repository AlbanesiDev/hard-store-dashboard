import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, signal } from "@angular/core";
import { MenuModule } from "primeng/menu";
import { ChartModule } from "primeng/chart";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, MenuModule, ChartModule],
  template: `
    <div class="flex flex-column gap-4 h-full w-full">
      <div class="flex gap-4">
        @for (item of dashboardData()[0].card; track $index) {
          <div class="card w-full h-10rem">
            <div class="flex justify-content-between align-items-start h-full">
              <div class="flex flex-column justify-content-between h-full">
                <h2 class="text-lg text-color-secondary font-normal m-0">{{ item.title }}</h2>
                <span class="text-xl font-bold">{{ item.value }}</span>
                <p class="text-lg text-green-400 m-0">
                  {{ item.value_text }}
                  <span class="text-color-secondary">{{ item.text }}</span>
                </p>
              </div>
              <div class="flex border-1 border-round surface-50 p-2 {{ item.class }}">
                <i class="text-2xl pi pi-{{ item.icon }}"></i>
              </div>
            </div>
          </div>
        }
      </div>
      <div class="flex gap-4">
        <div class="card w-6">
          <div class="flex justify-content-between align-items-center mb-5">
            <h2 class="text-lg text-color-secondary font-normal m-0 mb-3">Productos más vendidos</h2>
          </div>
          <ul class="list-none p-0 m-0">
            @for (item of dashboardData()[0].productsMostPopular; track $index) {
              <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div class="w-9">
                  <span class=" text-900 font-medium mr-2 mb-1 md:mb-0">{{ item.title }}</span>
                  <div class="text-600 mt-1">{{ item.category }}</div>
                </div>
                <div class="mt-2 md:mt-0 flex align-items-center">
                  <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" [ngStyle]="{ height: '8px' }">
                    <div class="bg-orange-500 h-full" [ngStyle]="{ width: item.value + '%' }"></div>
                  </div>
                  <span class="text-orange-500 ml-3 font-medium">%{{ item.value }}</span>
                </div>
              </li>
            }
          </ul>
        </div>

        <div class="card w-6">
          <h2 class="text-lg text-color-secondary font-normal m-0 mb-3">Resumen de ventas</h2>
          <p-chart type="line" [data]="chartData" [options]="chartOptions"></p-chart>
        </div>
      </div>

      <div class="card">
        <div class="flex align-items-center justify-content-between mb-4">
          <h2 class="text-lg text-color-secondary font-normal m-0 mb-3">Notificaciones</h2>
        </div>
        <span class="block text-600 font-medium mb-3">Hoy</span>
        <ul class="p-0 mx-0 mt-0 mb-4 list-none">
          <li class="flex align-items-center py-2 border-bottom-1 surface-border">
            <div
              class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0"
            >
              <i class="pi pi-dollar text-xl text-blue-500"></i>
            </div>
            <span class="text-900 line-height-3">
              Richard
              <span class="text-700">
                ha comprado un Procesador Intel Core i7 12700K 5.0GHz Turbo Socket 1700 Alder Lake
                <span class="text-blue-500">$409,900.00</span>
              </span>
            </span>
          </li>
          <li class="flex align-items-center py-2">
            <div
              class="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0"
            >
              <i class="pi pi-download text-xl text-orange-500"></i>
            </div>
            <span class="text-700 line-height-3">
              La solicitud de retirada de
              <span class="text-blue-500 font-medium">$2,500,000.00</span>
              ha sido iniciada.
            </span>
          </li>
        </ul>

        <span class="block text-600 font-medium mb-3">Ayer</span>
        <ul class="p-0 m-0 list-none">
          <li class="flex align-items-center py-2 border-bottom-1 surface-border">
            <div
              class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0"
            >
              <i class="pi pi-dollar text-xl text-blue-500"></i>
            </div>
            <span class="text-900 line-height-3">
              Alan
              <span class="text-700">
                ha comprado un Cooler CPU DeepCool AK620 DIGITAL Display <span class="text-blue-500">$118,150.00 </span>
              </span>
            </span>
          </li>
          <li class="flex align-items-center py-2 border-bottom-1 surface-border">
            <div
              class="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0"
            >
              <i class="pi pi-question text-xl text-pink-500"></i>
            </div>
            <span class="text-900 line-height-3">
              Jose
              <span class="text-700">
                ha publicado una nueva pregunta sobre Gabinete Antec NX292 MESH RGB Vidrio Templado.
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent implements OnInit {
  public chartData: any;
  public chartOptions: any;

  public dashboardData = signal<any>([
    {
      card: [
        {
          title: "Ordenes",
          value: "232",
          value_text: "12",
          text: "nuevas desde la última visita",
          icon: "pi pi-shopping-cart",
          class: "border-blue-400 text-blue-400",
        },
        {
          title: "Ganancias",
          value: "$32.040.429",
          value_text: "%24+",
          text: "desde la semana pasada",
          icon: "pi pi-money-bill",
          class: "border-yellow-400 text-yellow-400",
        },
        {
          title: "Clientes",
          value: "341",
          value_text: "39",
          text: "nuevos clientes",
          icon: "pi pi-users",
          class: "border-teal-400 text-teal-400",
        },
        {
          title: "Tickets",
          value: "5 sin leer",
          value_text: "10",
          text: "respondidos",
          icon: "pi pi-comment",
          class: "border-purple-400 text-purple-400",
        },
      ],
      productsMostPopular: [
        {
          title: "Procesador AMD Ryzen 5 8600G 5.0GHz AM5",
          category: "Procesadores",
          value: 76,
        },
        {
          title: "Fuente Cougar 750W 80 Plus Gold GEC750",
          category: "Fuentes",
          value: 65,
        },
        {
          title: "Monitor LG 24'' 24MK430H-B 75Hz IPS Full HD FreeSync HDMI",
          category: "Monitores",
          value: 63,
        },
        {
          title: "Cooler CPU DeepCool AK620 DIGITAL Display ",
          category: "Refrigeración",
          value: 43,
        },
        {
          title:
            "Kit Mother ASUS TUF B660M-PLUS WIFI D4 + Procesador Intel Core I5 12400F 4.4GHz Turbo (Sin Video Integrado)",
          category: "Kit de actualización",
          value: 28,
        },
        {
          title: "Memoria Team DDR5 32GB (2x16GB) 6400MHz T-Force Delta RGB Black CL40 Intel XMP 3.0",
          category: "Memorias RAM",
          value: 76,
        },
      ],
    },
  ]);

  ngOnInit(): void {
    this.initChart();
  }

  private initChart(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    this.chartData = {
      labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
      datasets: [
        {
          label: "Ventas por precio de lista",
          data: [80, 59, 60, 51, 56, 45, 30],
          fill: false,
          backgroundColor: documentStyle.getPropertyValue("--bluegray-700"),
          borderColor: documentStyle.getPropertyValue("--bluegray-700"),
          tension: 0.4,
        },
        {
          label: "Ventas por precio especial",
          data: [48, 32, 45, 40, 60, 80, 90],
          fill: false,
          backgroundColor: documentStyle.getPropertyValue("--green-600"),
          borderColor: documentStyle.getPropertyValue("--green-600"),
          tension: 0.4,
        },
      ],
    };
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
}
