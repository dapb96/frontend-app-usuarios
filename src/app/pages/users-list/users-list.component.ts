import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user-model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent, DialogData } from '../../components/delete-confirmation/delete-confirmation.component';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {

  users: User[] = [];
  tipoFiltro: 'demandante' | 'empleado' | 'todos' = 'todos';
  filteredUsers: User[] = [];

  public constructor(
    private userService: UserService, 
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
      this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      console.log(this.users);
      this.filterUsers();
    });
  }

  filterUsers(): void {
    if (this.tipoFiltro === 'todos') {
      this.filteredUsers = [...this.users]; // Crea una copia para evitar modificaciones directas
    } else {
      this.filteredUsers = this.users.filter(user => user.tipo === this.tipoFiltro);
    }
  }

  onView(user: User): void {
    console.log('Ver usuario:', user);
    // Implementar navegación a la página de detalle
    this.router.navigate(['/user', user.datosPersonales.nifPasaporte, 'view']);
  }

  onEdit(user: User): void {
    console.log('Editar usuario:', user);
    // Implementar navegación a la página de edición
    this.router.navigate(['/user', user.datosPersonales.nifPasaporte, 'edit']);
  }

  onDelete(user: User): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '400px',
      data: { userName: `${user.datosPersonales.nombre} ${user.datosPersonales.primerApellido}`, userNif: user.datosPersonales.nifPasaporte },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.datosPersonales.nifPasaporte);
      }
    });
  }

  onNewUser(): void {
    // Implementar navegación a la página de creación
    this.router.navigate(['/user', 'new']);
  }

}
