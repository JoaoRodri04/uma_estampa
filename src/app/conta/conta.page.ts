import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppStorageService } from '../services/app-storage.service';

@Component({
  selector: 'app-conta',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './conta.page.html',
  styleUrls: ['./conta.page.scss'],
})
export class ContaPage implements OnInit {
  modoLogin = true;
  usuarioAutenticado = false;
  usuarioLogado: any = null;
  
  loginForm!: FormGroup;
  registroForm!: FormGroup;
  
  mostrarSenhaLogin = false;
  mostrarSenhaRegistro = false;
  mensagemErro = '';
  senhasNaoCorrespondem = false;

  constructor(private fb: FormBuilder, private storageService: AppStorageService) {
    this.inicializarFormularios();
  }

  ngOnInit() {
    this.verificarUsuarioAutenticado();
  }

  /**
   * Inicializa os formulários de login e registro
   */
  inicializarFormularios() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
    });
  }

  /**
   * Troca entre modo login e registro
   */
  trocarModo(isLogin: boolean) {
    this.modoLogin = isLogin;
    this.mensagemErro = '';
    this.senhasNaoCorrespondem = false;
  }

  /**
   * Verifica se há um utilizador autenticado no armazenamento
   */
  async verificarUsuarioAutenticado() {
    try {
      const usuarioLocal = await this.storageService.get('usuarioEstampa');
      if (usuarioLocal) {
        this.usuarioLogado = usuarioLocal;
        this.usuarioAutenticado = true;
      }
    } catch (e) {
      console.error('Erro ao verificar utilizador:', e);
      this.usuarioAutenticado = false;
    }
  }

  /**
   * Executa o login do utilizador
   */
  async fazerLogin() {
    if (!this.loginForm.valid) {
      this.mensagemErro = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    try {
      const { email, senha } = this.loginForm.value;
      
      // Obter lista de utilizadores do armazenamento
      const usuarios = await this.obterUsuarios();
      const usuario = usuarios.find((u: any) => u.email === email && u.senha === senha);

      if (usuario) {
        // Login bem-sucedido
        const usuarioAutenticado = {
          nome: usuario.nome,
          email: usuario.email,
          dataLogin: new Date().toISOString()
        };
        
        await this.storageService.set('usuarioEstampa', usuarioAutenticado);
        this.usuarioLogado = usuarioAutenticado;
        this.usuarioAutenticado = true;
        this.mensagemErro = '';
        this.loginForm.reset();
      } else {
        // Credenciais inválidas
        this.mensagemErro = 'Email ou palavra-passe incorretos.';
      }
    } catch (e) {
      console.error('Erro no login:', e);
      this.mensagemErro = 'Erro ao processar o login. Tente novamente.';
    }
  }

  /**
   * Executa o registro de um novo utilizador
   */
  async fazerRegistro() {
    if (!this.registroForm.valid) {
      this.mensagemErro = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    try {
      const { nome, email, senha, confirmarSenha } = this.registroForm.value;

      // Validar se as senhas correspondem
      if (senha !== confirmarSenha) {
        this.senhasNaoCorrespondem = true;
        this.mensagemErro = 'As palavras-passe não correspondem.';
        return;
      }

      this.senhasNaoCorrespondem = false;

      // Obter lista de utilizadores
      const usuarios = await this.obterUsuarios();

      // Verificar se o email já existe
      if (usuarios.some((u: any) => u.email === email)) {
        this.mensagemErro = 'Este email já está registado. Tente fazer login.';
        return;
      }

      // Criar novo utilizador
      const novoUsuario = {
        id: Date.now(),
        nome,
        email,
        senha, // IMPORTANTE: Em produção, isto deve ser hasheado!
        dataCriacao: new Date().toISOString()
      };

      usuarios.push(novoUsuario);
      await this.storageService.set('usuariosEstampa', usuarios);

      // Autenticar automaticamente após registro
      const usuarioAutenticado = {
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        dataLogin: new Date().toISOString()
      };

      await this.storageService.set('usuarioEstampa', usuarioAutenticado);
      this.usuarioLogado = usuarioAutenticado;
      this.usuarioAutenticado = true;
      this.mensagemErro = '';
      this.registroForm.reset();
      this.modoLogin = true;
    } catch (e) {
      console.error('Erro no registro:', e);
      this.mensagemErro = 'Erro ao criar conta. Tente novamente.';
    }
  }

  /**
   * Faz logout do utilizador
   */
  async logout() {
    try {
      await this.storageService.remove('usuarioEstampa');
      this.usuarioLogado = null;
      this.usuarioAutenticado = false;
      this.loginForm.reset();
      this.registroForm.reset();
      this.mensagemErro = '';
    } catch (e) {
      console.error('Erro ao fazer logout:', e);
    }
  }

  /**
   * Obtém a lista de utilizadores do armazenamento
   */
  private async obterUsuarios(): Promise<any[]> {
    try {
      const usuarios = await this.storageService.get('usuariosEstampa');
      return usuarios || [];
    } catch (e) {
      console.error('Erro ao obter utilizadores:', e);
      return [];
    }
  }
}


