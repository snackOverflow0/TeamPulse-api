import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
  private readonly jwtSecret = 'JWT_ACCESS_SECRET_KEY_2026'
  private readonly refreshSecret = 'JWT_REFRESH_SECRET_KEY_2026'

  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email }
    })

    if (existingUser) {
      throw new BadRequestException('Email is already registered to an account')
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: 'USER'
      }
    })

    const tokens = await this.getTokens(newUser.id, newUser.email)
    await this.updateRefreshToken(newUser.id, tokens.refreshToken)
    return tokens
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email }
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials provided')
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials provided')
    }

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied: Session expired or invalid')
    }

    const isRefreshValid = await bcrypt.compare(refreshToken, user.refreshToken)
    if (!isRefreshValid) {
      throw new ForbiddenException('Access Denied: Token rotation tampered')
    }

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    })
    return { success: true, message: 'Session logged out successfully' }
  }

  private async getTokens(userId: string, email: string) {
    const accessToken = jwt.sign({ sub: userId, email }, this.jwtSecret, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ sub: userId, email }, this.refreshSecret, { expiresIn: '7d' })

    return { accessToken, refreshToken }
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefresh },
    });
  }
}
