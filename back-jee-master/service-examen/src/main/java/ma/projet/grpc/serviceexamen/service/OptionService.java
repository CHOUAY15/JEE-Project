package ma.projet.grpc.serviceexamen.service;

import ma.projet.grpc.serviceexamen.entity.Option;

import java.util.List;

public interface OptionService {
    Option createOption(Option option);
    Option updateOption(Long id, Option option);
    Option getOptionById(Long id);
    List<Option> getAllOptions();
    void deleteOption(Long id);
    List<Option> saveAllOptions(List<Option> options);
}