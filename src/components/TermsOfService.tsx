'use client';

import { useTheme } from '@/hooks/useTheme';
import { FileText, Shield, AlertCircle } from 'lucide-react';

export function TermsOfService() {
  const { isDark } = useTheme();

  return (
    <div className={`space-y-6 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
      {/* 标题 */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          isDark
            ? 'bg-gradient-to-br from-green-500 to-emerald-500'
            : 'bg-gradient-to-br from-green-300 to-emerald-300'
        }`}>
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-2xl font-semibold mb-4 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          使用条款
        </h3>
        <p className="text-sm">
          最后更新时间：2024年7月4日
        </p>
      </div>

      {/* 接受条款 */}
      <div className={`p-6 rounded-xl ${
        isDark ? 'bg-slate-700/50' : 'bg-blue-50'
      }`}>
        <h4 className={`text-lg font-semibold mb-3 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          1. 接受条款
        </h4>
        <p className="leading-relaxed">
          欢迎使用泡泡白噪音！通过访问和使用我们的网站，您同意遵守并受本使用条款的约束。如果您不同意这些条款，请不要使用我们的服务。
        </p>
      </div>

      {/* 服务描述 */}
      <div>
        <h4 className={`text-lg font-semibold mb-3 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          2. 服务描述
        </h4>
        <p className="leading-relaxed mb-4">
          泡泡白噪音是一个提供环境音效和放松工具的在线平台。我们的服务包括但不限于：
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>各种自然声音和环境音效播放</li>
          <li>番茄计时器和专注工具</li>
          <li>电子木鱼等放松功能</li>
          <li>个性化音效组合</li>
        </ul>
      </div>

      {/* 用户责任 */}
      <div>
        <h4 className={`text-lg font-semibold mb-3 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          3. 用户责任
        </h4>
        <div className="space-y-3">
          <p className="leading-relaxed">
            使用我们的服务时，您同意：
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>仅将服务用于个人、非商业目的</li>
            <li>不进行任何可能损害网站功能的行为</li>
            <li>不尝试未经授权访问我们的系统</li>
            <li>遵守所有适用的法律法规</li>
          </ul>
        </div>
      </div>

      {/* 知识产权 */}
      <div className={`p-6 rounded-xl ${
        isDark ? 'bg-slate-700/50' : 'bg-amber-50'
      }`}>
        <div className="flex items-start gap-3">
          <Shield className={`w-6 h-6 mt-1 ${
            isDark ? 'text-amber-400' : 'text-amber-500'
          }`} />
          <div>
            <h4 className={`text-lg font-semibold mb-3 ${
              isDark ? 'text-slate-200' : 'text-gray-800'
            }`}>
              4. 知识产权
            </h4>
            <p className="leading-relaxed">
              网站上的所有内容，包括但不限于音频文件、设计、文本、图形和软件，均受版权法和其他知识产权法保护。未经明确授权，您不得复制、分发或修改这些内容。
            </p>
          </div>
        </div>
      </div>

      {/* 免责声明 */}
      <div>
        <h4 className={`text-lg font-semibold mb-3 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          5. 免责声明
        </h4>
        <div className={`p-4 rounded-lg ${
          isDark ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`w-5 h-5 mt-0.5 ${
              isDark ? 'text-red-400' : 'text-red-500'
            }`} />
            <div className="text-sm">
              <p className="leading-relaxed">
                我们的服务按“现状”提供，不提供任何明示或暗示的保证。我们不保证服务的连续性、准确性或完整性。在法律允许的最大范围内，我们不承担任何直接、间接、偶然或后果性损害的责任。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 条款变更 */}
      <div>
        <h4 className={`text-lg font-semibold mb-3 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          6. 条款变更
        </h4>
        <p className="leading-relaxed">
          我们保留随时修改这些使用条款的权利。任何变更将在网站上发布后立即生效。继续使用我们的服务即表示您接受修改后的条款。
        </p>
      </div>

    </div>
  );
}