/* eslint-disable */
import { Inject, Injectable } from '@nestjs/common';
import { Console } from 'console';
import * as chalk from 'chalk';
import { LOGGER_CONFIG } from '../utils/logger.constants';
import { ILoggerConfig } from '../utils/logger-config.interface';
import * as util from 'util';

@Injectable()
export class LoggerDurationService {
    protected _console: Console = new Console(process.stdout);
    protected context = chalk.bgHex('#053610').hex('#ffffff').bold('🔧[ Logger Duration Service ]');

    constructor(@Inject(LOGGER_CONFIG) protected readonly config: ILoggerConfig) {}

    public getTimestamp(): bigint {
        try {
            const time = process.hrtime();
            return BigInt(((time[0] * 1000000 + time[1]) / 1000).toFixed(0));
        } catch (err) {
            this._metadataConsole()?.error(
                '🔺🔻',
                this.context,
                'could not generate timestamp',
                !this.config.LOGGER_DEBUG_DISABLED
                    ? util.inspect(
                          err,
                          this.config.LOGGER_DEBUG_SHOW_HIDDEN,
                          this.config.LOGGER_DEBUG_DEPTH,
                          true,
                      )
                    : err?.constructor?.name,
            );
        }
    }

    public getDuration(from: bigint): bigint {
        this._metadataConsole()?.log(this.context, 'getDuration', 'from ' + from, typeof from);
        try {
            // calculating difference
            const now: bigint = this.getTimestamp();
            const op_duration: bigint = now - from;

            // returning operation duration
            return op_duration;
        } catch (err) {
            this._metadataConsole()?.error(
                '🔺🔻',
                this.context,
                'could not calculate log step duration',
                !this.config.LOGGER_DEBUG_DISABLED
                    ? util.inspect(
                          err,
                          this.config.LOGGER_DEBUG_SHOW_HIDDEN,
                          this.config.LOGGER_DEBUG_DEPTH,
                          true,
                      )
                    : err?.constructor?.name,
            );
        }
    }

    public getFlowDuration(start: bigint): [duration: bigint, durationFriendly: string] {
        try {
            const duration = this.getTimestamp() - start;
            const durationFriendly = this._formatDuration(Number(duration.valueOf()));

            return [duration, durationFriendly];
        } catch (err) {
            this._metadataConsole()?.error(
                '🔺🔻',
                this.context,
                'could not calculate log flow duration',
                !this.config.LOGGER_DEBUG_DISABLED
                    ? util.inspect(
                          err,
                          this.config.LOGGER_DEBUG_SHOW_HIDDEN,
                          this.config.LOGGER_DEBUG_DEPTH,
                          true,
                      )
                    : err?.constructor?.name,
            );
            return [null, null];
        }
    }

    private _formatDuration(microseconds: number): string {
        try {
            const milliseconds: number = parseInt((microseconds / 1000).toFixed(0));
            const microseconds_left = microseconds - milliseconds * 1000;

            let parts = [];

            if (milliseconds / 3600000 >= 1) {
                const hours = Math.floor(milliseconds / 3600000);
                parts.push(hours + ' hr');
            }

            if (milliseconds / 60000 >= 1) {
                const minutes = Math.floor(milliseconds / 60000);
                parts.push(minutes + ' min');
            }

            if (milliseconds / 1000 >= 1) {
                const seconds = Math.floor(milliseconds / 1000);
                parts.push(seconds + ' sec');
            }

            if (milliseconds >= 0) {
                const mills = Math.floor(milliseconds);
                parts.push(mills + ' ms');
            }

            if (microseconds_left > 0) {
                parts.push(microseconds_left + ' μs');
            }

            if (microseconds_left < 0) {
                parts.push('0 μs');
            }

            return parts.join(', ');
        } catch (err) {
            this._metadataConsole().error(
                '🔺🔻',
                this.context,
                'could not format duration',
                !this.config.LOGGER_DEBUG_DISABLED
                    ? util.inspect(
                          err,
                          this.config.LOGGER_DEBUG_SHOW_HIDDEN,
                          this.config.LOGGER_DEBUG_DEPTH,
                          true,
                      )
                    : err?.constructor?.name,
            );
            console.log('ERR', err);

            return '0';
        }
    }

    public styleDuration(duration: number): [number, number, number] {
        const percentColors = [
            { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
            { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
            { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } },
        ];

        const getColorForPercentage = (pct: number): [number, number, number] => {
            let target = 1;
            do {
                if (pct <= percentColors[target].pct) {
                    break;
                }
                target++;
            } while (target < percentColors.length);

            target = Math.min(target, percentColors.length - 1);

            const lower = percentColors[target - 1];
            const upper = percentColors[target];
            const range = upper?.pct - lower.pct;
            const rangePct = (pct - lower.pct) / range;
            const pctLower = 1 - rangePct;
            const pctUpper = rangePct;
            const color = {
                r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
            };

            return [color.g, color.r, color.b];
        };

        const getPercentage = (input: number, min: number, max: number) => {
            if (input <= min) {
                return 0;
            }

            if (input >= max) {
                return 1;
            }

            const perc = (input - min) / (max - min);
            return perc;
        };

        return getColorForPercentage(
            getPercentage(
                duration,
                this.config.LOGGER_VISUALISED_DURATION_MIN,
                this.config.LOGGER_VISUALISED_DURATION_MAX,
            ),
        );
    }

    private _metadataConsole(): Console {
        return this.config.LOGGER_DISPLAY_METADATA ? this._console : undefined;
    }
}
