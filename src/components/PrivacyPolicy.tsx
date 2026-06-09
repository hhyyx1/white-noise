'use client';

import { useTheme } from '@/hooks/useTheme';
import { Lock, Eye, Database, UserCheck } from 'lucide-react';

export function PrivacyPolicy() {
  const { isDark } = useTheme();

  return (
    <div className={`space-y-6 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
      {/* 标题 */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          isDark
            ? 'bg-gradient-to-br from-purple-500 to-indigo-500'
            : 'bg-gradient-to-br from-purple-300 to-indigo-300'
        }`}>
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-2xl font-semibold mb-4 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          隐私政策
        </h3>
        <p className="text-sm">
          最后更新时间：2024年7月4日
        </p>
      </div>

      {/* 概述 */}
      <div className={`p-6 rounded-xl ${
        isDark ? 'bg-slate-700/50' : 'bg-blue-50'
      }`}>
        <h4 className={`text-lg font-semibold mb-3 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          隐私保护承诺
        </h4>
        <p className="leading-relaxed">
          泡泡白噪音非常重视您的隐私保护。本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。我们承诺以透明和负责任的方式处理您的数据。
        </p>
      </div>

      {/* 信息收集 */}
      <div>
        <h4 className={`text-lg font-semibold mb-4 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          我们收集的信息
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-slate-700/30' : 'bg-gray-50'
          }`}>
            <Eye className={`w-6 h-6 mb-2 ${
              isDark ? 'text-blue-400' : 'text-blue-500'
            }`} />
            <h5 className={`font-medium mb-2 ${
              isDark ? 'text-slate-200' : 'text-gray-800'
            }`}>
              使用数据
            </h5>
            <p className="text-sm">
              我们可能收集您如何使用我们服务的信息，如访问时间、使用的功能和偏好设置。
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-slate-700/30' : 'bg-gray-50'
          }`}>
            <Database className={`w-6 h-6 mb-2 ${
              isDark ? 'text-green-400' : 'text-green-500'
            }`} />
            <h5 className={`font-medium mb-2 ${
              isDark ? 'text-slate-200' : 'text-gray-800'
            }`}>
              本地存储
            </h5>
            <p className="text-sm">
              我们使用浏览器本地存储来保存您的主题偏好和音量设置，这些数据仅存储在您的设备上。
            </p>
          </div>
        </div>
      </div>

      {/* 信息使用 */}
      <div>
        <h4 className={`text-lg font-semibold mb-3 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          信息使用方式
        </h4>
        <p className="leading-relaxed mb-4">
          我们收集的信息仅用于以下目的：
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>提供和改进我们的服务</li>
          <li>记住您的偏好设置</li>
          <li>分析网站使用情况以优化用户体验</li>
          <li>确保网站安全和正常运行</li>
        </ul>
      </div>

      {/* 数据保护 */}
      <div className={`p-6 rounded-xl ${
        isDark ? 'bg-slate-700/50' : 'bg-green-50'
      }`}>
        <div className="flex items-start gap-3">
          <UserCheck className={`w-6 h-6 mt-1 ${
            isDark ? 'text-green-400' : 'text-green-500'
          }`} />
          <div>
            <h4 className={`text-lg font-semibold mb-3 ${
              isDark ? 'text-slate-200' : 'text-gray-800'
            }`}>
              数据保护措施
            </h4>
            <p className="leading-relaxed">
              我们采用适当的技术和组织措施来保护您的个人信息，防止未经授权的访问、使用、披露、修改或销毁。我们定期审查和更新我们的安全措施。
            </p>
          </div>
        </div>
      </div>

      {/* 第三方服务 */}
      <div>
        <h4 className={`text-lg font-semibold mb-3 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          第三方服务
        </h4>
        <p className="leading-relaxed mb-4">
          我们的网站可能使用第三方服务来提供更好的用户体验：
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>网站分析工具（如Google Analytics）</li>
          <li>内容分发网络（CDN）</li>
          <li>云存储服务</li>
        </ul>
        <p className="leading-relaxed mt-4 text-sm">
          这些第三方服务有自己的隐私政策，我们建议您查阅相关政策。
        </p>
      </div>

      {/* Cookie政策 */}
      <div>
        <h4 className={`text-lg font-semibold mb-3 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          Cookie 和本地存储
        </h4>
        <p className="leading-relaxed mb-4">
          我们使用Cookie和本地存储技术来：
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>记住您的主题偏好（白天/夜间模式）</li>
          <li>保存音量和音效设置</li>
          <li>改善网站性能和用户体验</li>
        </ul>
        <p className="leading-relaxed mt-4 text-sm">
          您可以通过浏览器设置管理或删除这些数据。
        </p>
      </div>

      {/* 您的权利 */}
      <div className={`p-6 rounded-xl ${
        isDark ? 'bg-slate-700/50' : 'bg-amber-50'
      }`}>
        <h4 className={`text-lg font-semibold mb-3 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          您的权利
        </h4>
        <p className="leading-relaxed mb-4">
          您对自己的个人信息享有以下权利：
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>了解我们收集和使用您信息的方式</li>
          <li>要求访问、更正或删除您的个人信息</li>
          <li>撤回您之前给予的同意</li>
          <li>对我们的数据处理提出异议</li>
        </ul>
      </div>

      {/* 政策更新 */}
      <div>
        <h4 className={`text-lg font-semibold mb-3 ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          政策更新
        </h4>
        <p className="leading-relaxed">
          我们可能会不时更新本隐私政策。任何重大变更都会在网站上显著位置通知您。我们建议您定期查看本政策以了解最新信息。
        </p>
      </div>

    </div>
  );
}