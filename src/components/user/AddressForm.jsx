import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { translate } from '../../utils/translate';
import { addAddress, updateAddress } from '../../api/users';
import { FaMapMarkerAlt, FaUser, FaPhone, FaCity, FaBuilding, FaGlobe, FaCheckCircle, FaTimes } from 'react-icons/fa';

const addressSchema = z.object({
  type: z.enum(['billing', 'shipping', 'both']),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().optional(),
  addressLine1: z.string().min(5, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  isDefault: z.boolean().optional(),
});

const AddressForm = ({ address, onSuccess, onCancel }) => {
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!address;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: address || {
      type: 'both',
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      isDefault: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      let response;
      if (isEditMode) {
        response = await updateAddress(address._id, data);
      } else {
        response = await addAddress(data);
      }

      if (response.data.success) {
        setSuccess(true);
        reset();
        setTimeout(() => {
          setSuccess(false);
          if (onSuccess) onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} address`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`rounded-2xl shadow-lg p-6 ${
      isDarkMode
        ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700'
        : 'bg-white/95 backdrop-blur-md border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {isEditMode
            ? translate('address.edit', currentLanguage) || 'Edit Address'
            : translate('address.add', currentLanguage) || 'Add New Address'}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/50 flex items-center space-x-2"
        >
          <FaCheckCircle className="text-green-500" />
          <p className="text-sm text-green-600 dark:text-green-400">
            {translate('address.success', currentLanguage) || 'Address saved successfully!'}
          </p>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50"
        >
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Address Type */}
        <div>
          <label
            htmlFor="type"
            className={`block text-left text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {translate('address.type', currentLanguage) || 'Address Type'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt
                className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
              />
            </div>
            <select
              {...register('type')}
              id="type"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors text-left ${
                errors.type
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
              } focus:outline-none focus:ring-2 appearance-none cursor-pointer`}
            >
              <option value="both">{translate('address.both', currentLanguage) || 'Both (Billing & Shipping)'}</option>
              <option value="billing">{translate('address.billing', currentLanguage) || 'Billing'}</option>
              <option value="shipping">{translate('address.shipping', currentLanguage) || 'Shipping'}</option>
            </select>
          </div>
          {errors.type && (
            <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className={`block text-left text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {translate('auth.fullName', currentLanguage) || 'Full Name'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser
                className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
              />
            </div>
            <input
              {...register('fullName')}
              type="text"
              id="fullName"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors text-left ${
                errors.fullName
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
              } focus:outline-none focus:ring-2`}
              placeholder={translate('auth.fullNamePlaceholder', currentLanguage) || 'John Doe'}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className={`block text-left text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {translate('auth.phone', currentLanguage) || 'Phone'} ({translate('auth.optional', currentLanguage) || 'Optional'})
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaPhone
                className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
              />
            </div>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors text-left ${
                errors.phone
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
              } focus:outline-none focus:ring-2`}
              placeholder={translate('auth.phonePlaceholder', currentLanguage) || '+1 234 567 8900'}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Address Line 1 */}
        <div>
          <label
            htmlFor="addressLine1"
            className={`block text-left text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {translate('address.line1', currentLanguage) || 'Address Line 1'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt
                className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
              />
            </div>
            <input
              {...register('addressLine1')}
              type="text"
              id="addressLine1"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors text-left ${
                errors.addressLine1
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
              } focus:outline-none focus:ring-2`}
              placeholder={translate('address.line1Placeholder', currentLanguage) || 'Street address, P.O. box'}
            />
          </div>
          {errors.addressLine1 && (
            <p className="mt-1 text-sm text-red-500">{errors.addressLine1.message}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <label
            htmlFor="addressLine2"
            className={`block text-left text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {translate('address.line2', currentLanguage) || 'Address Line 2'} ({translate('auth.optional', currentLanguage) || 'Optional'})
          </label>
          <input
            {...register('addressLine2')}
            type="text"
            id="addressLine2"
            className={`w-full px-4 py-3 rounded-lg border transition-colors text-left ${
              errors.addressLine2
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
            } focus:outline-none focus:ring-2`}
            placeholder={translate('address.line2Placeholder', currentLanguage) || 'Apartment, suite, unit, building, floor, etc.'}
          />
          {errors.addressLine2 && (
            <p className="mt-1 text-sm text-red-500">{errors.addressLine2.message}</p>
          )}
        </div>

        {/* City, State, Postal Code Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* City */}
          <div>
            <label
              htmlFor="city"
              className={`block text-left text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {translate('address.city', currentLanguage) || 'City'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCity
                  className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                />
              </div>
              <input
                {...register('city')}
                type="text"
                id="city"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors text-left ${
                  errors.city
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
                } focus:outline-none focus:ring-2`}
                placeholder={translate('address.cityPlaceholder', currentLanguage) || 'City'}
              />
            </div>
            {errors.city && (
              <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label
              htmlFor="state"
              className={`block text-left text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {translate('address.state', currentLanguage) || 'State/Province'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBuilding
                  className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                />
              </div>
              <input
                {...register('state')}
                type="text"
                id="state"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors text-left ${
                  errors.state
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
                } focus:outline-none focus:ring-2`}
                placeholder={translate('address.statePlaceholder', currentLanguage) || 'State'}
              />
            </div>
            {errors.state && (
              <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <label
              htmlFor="postalCode"
              className={`block text-left text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {translate('address.postalCode', currentLanguage) || 'Postal Code'}
            </label>
            <input
              {...register('postalCode')}
              type="text"
              id="postalCode"
              className={`w-full px-4 py-3 rounded-lg border transition-colors text-left ${
                errors.postalCode
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
              } focus:outline-none focus:ring-2`}
              placeholder={translate('address.postalCodePlaceholder', currentLanguage) || '12345'}
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-500">{errors.postalCode.message}</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className={`block text-left text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {translate('address.country', currentLanguage) || 'Country'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaGlobe
                className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
              />
            </div>
            <input
              {...register('country')}
              type="text"
              id="country"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors text-left ${
                errors.country
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
              } focus:outline-none focus:ring-2`}
              placeholder={translate('address.countryPlaceholder', currentLanguage) || 'United States'}
            />
          </div>
          {errors.country && (
            <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
          )}
        </div>

        {/* Default Address Checkbox */}
        <div className="flex items-center">
          <input
            {...register('isDefault')}
            type="checkbox"
            id="isDefault"
            className={`w-4 h-4 rounded border-gray-300 text-primary-light focus:ring-primary-light ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'
            }`}
          />
          <label
            htmlFor="isDefault"
            className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            {translate('address.setDefault', currentLanguage) || 'Set as default address'}
          </label>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : isDarkMode
                ? 'bg-primary-dark hover:bg-primary-light text-white'
                : 'bg-primary-light hover:bg-primary-dark text-white'
            }`}
          >
            {isLoading
              ? translate('common.saving', currentLanguage) || 'Saving...'
              : isEditMode
              ? translate('address.update', currentLanguage) || 'Update Address'
              : translate('address.add', currentLanguage) || 'Add Address'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {translate('common.cancel', currentLanguage) || 'Cancel'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddressForm;

