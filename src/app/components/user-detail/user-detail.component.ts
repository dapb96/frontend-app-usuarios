import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Demandante, Empleado } from '../../models/user-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {
  nifPasaporte: string | null = null;
  user: Demandante | Empleado | undefined;
  activeTab: 'personal' | 'direccion' | 'estudios' | 'experiencia' = 'personal';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.nifPasaporte = params['id'];
      if (this.nifPasaporte) {
        this.loadUserDetail(this.nifPasaporte);
      }
    });
  }


  loadUserDetail(nifPasaporte: string): void {
    this.userService.getUsers().subscribe(users => {
      this.user = users.find(user => user.datosPersonales.nifPasaporte === nifPasaporte);
    });
  }

  setActiveTab(tab: 'personal' | 'direccion' | 'estudios' | 'experiencia'): void {
    this.activeTab = tab;
  }

  get demandante(): Demandante | undefined {
    return this.user?.tipo === 'demandante' ? (this.user as Demandante) : undefined;
  }

  get empleado(): Empleado | undefined {
    return this.user?.tipo === 'empleado' ? (this.user as Empleado) : undefined;
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}



