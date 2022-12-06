import { DEFAULT_TIMEOUT_MS } from "@/config/httpAdapter";
import { Injectable, Logger } from "@nestjs/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { inspect } from "util";

@Injectable()
export class AxiosService {
  private readonly logger = new Logger(AxiosService.name)

  public async get<T>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await axios.get<T>(path, {
        timeout: DEFAULT_TIMEOUT_MS,
        ...(config || {}),
      })
    } catch (error) {
      const errorMsg = error && error instanceof Error
        ? error.message
        : inspect(error)

      this.logger.error(`Axios Request Failed. Error: ${errorMsg}`)
      throw error
    }
  }
}